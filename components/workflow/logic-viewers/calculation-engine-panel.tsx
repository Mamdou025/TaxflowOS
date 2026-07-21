"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { WorkflowBlock } from "@/lib/local-fiscal-workflow";
import type { WorkflowEdge, WorkflowNode } from "@/lib/workflow-store";

// ─── Types ────────────────────────────────────────────────────────────────────

export type InlineFormula = {
  calculationId: string;
  description?: string;
  formulaExpression?: string;
  label: string;
  operands: Array<string | number>;
  operation: string;
  resultKey: string;
};

type CalculationMode = "auto" | "inline" | "external_rules";

type DisplayToken =
  | { type: "ref"; value: string }
  | { type: "op"; value: string }
  | { type: "num"; value: string }
  | { type: "func"; value: string }
  | { type: "paren"; value: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

const KNOWN_FUNCTIONS = new Set([
  "abs",
  "max",
  "min",
  "round",
  "max_subtract_zero",
  "min_multiply_cap",
]);
const DIGIT_CHARACTER_REGEX = /\d/;
const IDENTIFIER_CHARACTER_REGEX = /[A-Za-z0-9_:.@-]/;
const IDENTIFIER_START_REGEX = /[A-Za-z_]/;
const NUMBER_CHARACTER_REGEX = /[\d.]/;
const WHITESPACE_CHARACTER_REGEX = /\s/;
const OPERATOR_TOKENS = new Set(["+", "-", "*", "/"]);

function getSingleCharacterToken(character: string): DisplayToken | null {
  if (character === "(" || character === ")") {
    return { type: "paren", value: character };
  }
  if (character === ",") {
    return { type: "op", value: "," };
  }
  if (OPERATOR_TOKENS.has(character)) {
    return { type: "op", value: character };
  }
  return null;
}

function readNumberToken(expression: string, startIndex: number) {
  let endIndex = startIndex + 1;
  while (
    endIndex < expression.length &&
    NUMBER_CHARACTER_REGEX.test(expression[endIndex])
  ) {
    endIndex += 1;
  }
  return {
    nextIndex: endIndex,
    token: { type: "num", value: expression.slice(startIndex, endIndex) },
  } satisfies { nextIndex: number; token: DisplayToken };
}

function readIdentifierToken(expression: string, startIndex: number) {
  let endIndex = startIndex + 1;
  while (
    endIndex < expression.length &&
    IDENTIFIER_CHARACTER_REGEX.test(expression[endIndex])
  ) {
    endIndex += 1;
  }
  const word = expression.slice(startIndex, endIndex);
  return {
    nextIndex: endIndex,
    token: {
      type: KNOWN_FUNCTIONS.has(word) ? "func" : "ref",
      value: word,
    },
  } satisfies { nextIndex: number; token: DisplayToken };
}

function getTokenAt(expression: string, index: number) {
  const character = expression[index];
  if (WHITESPACE_CHARACTER_REGEX.test(character)) {
    return { nextIndex: index + 1, token: null };
  }

  const singleCharacterToken = getSingleCharacterToken(character);
  if (singleCharacterToken) {
    return { nextIndex: index + 1, token: singleCharacterToken };
  }

  if (
    DIGIT_CHARACTER_REGEX.test(character) ||
    (character === "." &&
      DIGIT_CHARACTER_REGEX.test(expression[index + 1] ?? ""))
  ) {
    return readNumberToken(expression, index);
  }

  if (IDENTIFIER_START_REGEX.test(character)) {
    return readIdentifierToken(expression, index);
  }

  return { nextIndex: index + 1, token: null };
}

function tokenizeExpression(expression: string): DisplayToken[] {
  const tokens: DisplayToken[] = [];
  let i = 0;
  while (i < expression.length) {
    const { nextIndex, token } = getTokenAt(expression, i);
    if (token) {
      tokens.push(token);
    }
    i = nextIndex;
  }
  return tokens;
}

function tokensToExpression(tokens: DisplayToken[]): string {
  return tokens.map((t) => t.value).join(" ");
}

function getTokenItems(tokens: DisplayToken[]) {
  const counts = new Map<string, number>();
  return tokens.map((token) => {
    const baseKey = `${token.type}:${token.value}`;
    const count = (counts.get(baseKey) ?? 0) + 1;
    counts.set(baseKey, count);
    return { key: `${baseKey}:${count}`, token };
  });
}

function formulaToExpression(formula: InlineFormula): string {
  if (formula.formulaExpression?.trim()) {
    return formula.formulaExpression.trim();
  }
  const ops = formula.operands.map(String);
  switch (formula.operation) {
    case "pass_through":
      return ops[0] ?? "";
    case "add":
      return ops.join(" + ");
    case "subtract":
      return ops.length > 1
        ? `${ops[0]} - ${ops.slice(1).join(" - ")}`
        : (ops[0] ?? "");
    case "multiply":
      return ops.join(" * ");
    case "divide":
      return ops.length > 1
        ? `${ops[0]} / ${ops.slice(1).join(" / ")}`
        : (ops[0] ?? "");
    default:
      return ops.length > 0 ? `${formula.operation}(${ops.join(", ")})` : "";
  }
}

function getFormulasFromConfig(
  config: Record<string, unknown>
): InlineFormula[] {
  const raw =
    config.formulas ?? config.calculationRules ?? config.inlineFormulas;
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter(
    (item): item is InlineFormula =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as InlineFormula).calculationId === "string"
  );
}

function hasConnectedCalculationRuleSource(
  block: WorkflowBlock,
  edges: WorkflowEdge[]
) {
  return edges.some(
    (edge) =>
      edge.target === block.id &&
      (edge.data?.targetInputRole === "calculation_rules" ||
        edge.data?.workflowEdge?.targetInputRole === "calculation_rules")
  );
}

function getCalculationRunModeLabel(mode: string) {
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
  "calculatedResults",
];
const FALLBACK_VALUE_KEYS = ["fatPaid", "rtf", "inclusionRate", "fxRate"];

function isCalculationInputRole(role?: string) {
  return (
    role === "named_values" ||
    role === "fapi_inputs" ||
    role === "protected_inputs"
  );
}

function addUpstreamValue({
  key,
  result,
  seen,
  value,
}: {
  key: string;
  result: Array<{ key: string; value: number | null }>;
  seen: Set<string>;
  value: unknown;
}) {
  if (seen.has(key)) {
    return;
  }
  seen.add(key);
  result.push({ key, value: asNumber(value) });
}

function addOutputGroups({
  result,
  seen,
  sourceOutput,
}: {
  result: Array<{ key: string; value: number | null }>;
  seen: Set<string>;
  sourceOutput: Record<string, unknown>;
}) {
  for (const key of UPSTREAM_VALUE_GROUP_KEYS) {
    const group = asRecord(sourceOutput[key]);
    for (const [valueKey, value] of Object.entries(group)) {
      addUpstreamValue({ key: valueKey, result, seen, value });
    }
  }
}

function addFallbackValues({
  result,
  seen,
}: {
  result: Array<{ key: string; value: number | null }>;
  seen: Set<string>;
}) {
  for (const key of FALLBACK_VALUE_KEYS) {
    addUpstreamValue({ key, result, seen, value: null });
  }
}

function collectUpstreamValues(
  block: WorkflowBlock,
  edges: WorkflowEdge[],
  nodes: WorkflowNode[],
  lastOutput: Record<string, unknown>
): Array<{ key: string; value: number | null }> {
  const seen = new Set<string>();
  const result: Array<{ key: string; value: number | null }> = [];
  const incomingEdges = edges.filter((e) => e.target === block.id);

  for (const edge of incomingEdges) {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    if (!sourceNode) {
      continue;
    }
    const sourceBlock = sourceNode.data.block;
    const role =
      edge.data?.targetInputRole ?? edge.data?.workflowEdge?.targetInputRole;
    if (!isCalculationInputRole(role)) {
      continue;
    }

    const sourceOutput = asRecord(
      lastOutput[edge.source] ?? lastOutput[sourceBlock?.id ?? ""] ?? {}
    );
    addOutputGroups({ result, seen, sourceOutput });
  }

  addFallbackValues({ result, seen });

  return result;
}

// ─── Token chip display ───────────────────────────────────────────────────────

function TokenChip({
  termKeys,
  token,
  upstreamKeys,
}: {
  termKeys: Set<string>;
  token: DisplayToken;
  upstreamKeys: Set<string>;
}) {
  const operatorLabels: Record<string, string> = {
    "*": "×",
    "-": "−",
    "/": "÷",
  };
  const displayValue = operatorLabels[token.value] ?? token.value;

  if (token.type === "op") {
    return (
      <span className="inline-flex select-none items-center rounded px-1.5 py-0.5 font-bold font-mono text-foreground/60 text-xs">
        {displayValue}
      </span>
    );
  }
  if (token.type === "paren") {
    return (
      <span className="inline-flex select-none items-center rounded px-1 py-0.5 font-mono text-muted-foreground text-xs">
        {token.value}
      </span>
    );
  }
  if (token.type === "num") {
    return (
      <span className="inline-flex items-center rounded border border-amber-400/50 bg-amber-400/15 px-1.5 py-0.5 font-mono text-[11px] text-amber-700 dark:text-amber-400">
        {token.value}
      </span>
    );
  }
  if (token.type === "func") {
    return (
      <span className="inline-flex items-center rounded border border-violet-400/50 bg-violet-400/15 px-1.5 py-0.5 font-mono text-[11px] text-violet-700 dark:text-violet-400">
        {token.value}
      </span>
    );
  }
  // ref — colour by source
  if (termKeys.has(token.value)) {
    return (
      <span className="inline-flex items-center rounded border border-emerald-400/50 bg-emerald-400/15 px-1.5 py-0.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
        {token.value}
      </span>
    );
  }
  if (upstreamKeys.has(token.value)) {
    return (
      <span className="inline-flex items-center rounded border border-sky-400/50 bg-sky-400/15 px-1.5 py-0.5 font-mono text-[11px] text-sky-700 dark:text-sky-400">
        {token.value}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded border border-muted-foreground/30 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-foreground">
      {token.value}
    </span>
  );
}

// ─── Special functions catalog ────────────────────────────────────────────────

const SPECIAL_FUNCTIONS = [
  { display: "max(A−B, 0)", name: "max_subtract_zero" },
  { display: "min(A×B, C)", name: "min_multiply_cap" },
  { display: "abs(…)", name: "abs" },
  { display: "max(…)", name: "max" },
  { display: "min(…)", name: "min" },
  { display: "round(…)", name: "round" },
] as const;

const OPERATOR_KEYS = [
  { label: "+", value: "+" },
  { label: "−", value: "-" },
  { label: "×", value: "*" },
  { label: "÷", value: "/" },
  { label: "(", value: "(" },
  { label: ")", value: ")" },
  { label: ",", value: "," },
] as const;

// ─── CalculationEngineModeSection ─────────────────────────────────────────────

export function CalculationEngineModeSection({
  block,
  createTermRequest,
  disabled,
  edges,
  insertRequest,
  lastRunOutput,
  nodes,
  onSelectedTermIdChange,
  onUpdateConfig,
  selectedTermId,
}: {
  block: WorkflowBlock;
  createTermRequest?: number;
  disabled: boolean;
  edges: WorkflowEdge[];
  insertRequest?: { id: string; key: string } | null;
  lastRunOutput: Record<string, unknown>;
  nodes: WorkflowNode[];
  onSelectedTermIdChange?: (termId: string | null) => void;
  onUpdateConfig: (key: string, value: unknown) => void;
  selectedTermId?: string | null;
}) {
  const config = block.config as Record<string, unknown>;
  const mode = (config.mode as CalculationMode | undefined) ?? "auto";
  const formulas = getFormulasFromConfig(config);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tokens, setTokens] = useState<DisplayToken[]>([]);
  const [constantInput, setConstantInput] = useState("");
  const handledCreateRequestRef = useRef<number | undefined>(undefined);
  const handledInsertRequestRef = useRef<string | undefined>(undefined);

  const upstreamValues = collectUpstreamValues(
    block,
    edges,
    nodes,
    lastRunOutput
  );
  const upstreamKeys = new Set(upstreamValues.map((v) => v.key));
  const allTermKeys = new Set(formulas.map((f) => f.resultKey));
  const tokenItems = getTokenItems(tokens);

  const selectedFormula =
    selectedIndex !== null ? (formulas[selectedIndex] ?? null) : null;

  const hasExternalRules = hasConnectedCalculationRuleSource(block, edges);

  // ── Persistence helpers ──────────────────────────────────────────────────────

  const saveFormulas = useCallback(
    (next: InlineFormula[]) => {
      onUpdateConfig("formulas", next);
    },
    [onUpdateConfig]
  );

  const saveTokens = useCallback(
    (nextTokens: DisplayToken[]) => {
      if (selectedIndex === null) {
        return;
      }
      setTokens(nextTokens);
      const expression = tokensToExpression(nextTokens);
      const next = [...formulas];
      next[selectedIndex] = {
        ...next[selectedIndex],
        formulaExpression: expression,
        operands: [],
        operation: "pass_through",
      };
      saveFormulas(next);
    },
    [formulas, saveFormulas, selectedIndex]
  );

  // ── Term selection ───────────────────────────────────────────────────────────

  const selectTerm = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      const formula = formulas[index];
      setTokens(tokenizeExpression(formulaToExpression(formula)));
      setConstantInput("");
      onSelectedTermIdChange?.(formula.resultKey);
    },
    [formulas, onSelectedTermIdChange]
  );

  // ── Token insertion ──────────────────────────────────────────────────────────

  const appendToken = useCallback(
    (token: DisplayToken) => {
      if (disabled) {
        return;
      }
      saveTokens([...tokens, token]);
    },
    [disabled, saveTokens, tokens]
  );

  const appendRef = useCallback(
    (key: string) => appendToken({ type: "ref", value: key }),
    [appendToken]
  );

  const appendFunc = useCallback(
    (name: string) => {
      if (disabled) {
        return;
      }
      saveTokens([
        ...tokens,
        { type: "func", value: name },
        { type: "paren", value: "(" },
      ]);
    },
    [disabled, saveTokens, tokens]
  );

  const appendOp = useCallback(
    (op: string) => {
      const isParenLike = op === "(" || op === ")";
      appendToken({ type: isParenLike ? "paren" : "op", value: op });
    },
    [appendToken]
  );

  const insertConstant = () => {
    if (!constantInput.trim()) {
      return;
    }
    const num = Number.parseFloat(constantInput);
    if (!Number.isFinite(num)) {
      return;
    }
    appendToken({ type: "num", value: constantInput.trim() });
    setConstantInput("");
  };

  const backspace = () => {
    if (disabled || tokens.length === 0) {
      return;
    }
    saveTokens(tokens.slice(0, -1));
  };

  const clearFormula = () => {
    if (disabled) {
      return;
    }
    saveTokens([]);
  };

  // ── Term metadata ────────────────────────────────────────────────────────────

  const updateFormulaField = (
    field: "resultKey" | "label" | "description",
    value: string
  ) => {
    if (disabled || selectedIndex === null) {
      return;
    }
    const next = [...formulas];
    const updated = { ...next[selectedIndex], [field]: value };
    if (field === "resultKey") {
      updated.calculationId = value;
      onSelectedTermIdChange?.(value);
    }
    next[selectedIndex] = updated;
    saveFormulas(next);
  };

  // ── Term CRUD ────────────────────────────────────────────────────────────────

  const addTerm = useCallback(() => {
    if (disabled) {
      return;
    }
    const id = `TERM_${formulas.length + 1}`;
    const newFormula: InlineFormula = {
      calculationId: id,
      formulaExpression: "",
      label: id,
      operands: [],
      operation: "pass_through",
      resultKey: id,
    };
    const next = [...formulas, newFormula];
    saveFormulas(next);
    const newIndex = next.length - 1;
    setSelectedIndex(newIndex);
    setTokens([]);
    setConstantInput("");
    onSelectedTermIdChange?.(id);
  }, [disabled, formulas, onSelectedTermIdChange, saveFormulas]);

  const deleteTerm = (index: number) => {
    if (disabled) {
      return;
    }
    const next = formulas.filter((_, i) => i !== index);
    saveFormulas(next);
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setTokens([]);
      onSelectedTermIdChange?.(null);
    } else if (selectedIndex !== null && selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  useEffect(() => {
    if (!selectedTermId) {
      return;
    }
    const index = formulas.findIndex(
      (formula) =>
        formula.resultKey === selectedTermId ||
        formula.calculationId === selectedTermId
    );
    if (index >= 0 && index !== selectedIndex) {
      selectTerm(index);
    }
  }, [formulas, selectedIndex, selectedTermId, selectTerm]);

  useEffect(() => {
    if (
      createTermRequest === undefined ||
      createTermRequest <= 0 ||
      createTermRequest === handledCreateRequestRef.current
    ) {
      return;
    }
    handledCreateRequestRef.current = createTermRequest;
    addTerm();
  }, [addTerm, createTermRequest]);

  useEffect(() => {
    if (
      !insertRequest ||
      insertRequest.id === handledInsertRequestRef.current
    ) {
      return;
    }
    handledInsertRequestRef.current = insertRequest.id;
    appendRef(insertRequest.key);
  }, [appendRef, insertRequest]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-2">
      {/* Compact mode selector */}
      <div className="flex items-center gap-2">
        <span className="shrink-0 font-semibold text-[9px] text-muted-foreground uppercase tracking-widest">
          Mode
        </span>
        <Select
          disabled={disabled}
          onValueChange={(v) => onUpdateConfig("mode", v)}
          value={mode}
        >
          <SelectTrigger className="h-6 flex-1 text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-xs" value="auto">
              Auto —{" "}
              {hasExternalRules
                ? "using connected source"
                : "using inline formulas"}
            </SelectItem>
            <SelectItem className="text-xs" value="inline">
              Inline formulas
            </SelectItem>
            <SelectItem className="text-xs" value="external_rules">
              External rules (require source)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Calculator body */}
      <div
        className="overflow-hidden rounded-lg border"
        style={{ minHeight: 500 }}
      >
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center gap-2 border-b bg-muted/20 px-3 py-2">
            <span className="shrink-0 font-semibold text-[9px] text-muted-foreground uppercase tracking-widest">
              Editing
            </span>
            <Select
              disabled={disabled || formulas.length === 0}
              onValueChange={(value) => {
                const index = formulas.findIndex(
                  (formula) => formula.resultKey === value
                );
                if (index >= 0) {
                  selectTerm(index);
                }
              }}
              value={selectedFormula?.resultKey || ""}
            >
              <SelectTrigger className="h-7 min-w-0 flex-1 text-xs">
                <SelectValue placeholder="Select a created term" />
              </SelectTrigger>
              <SelectContent>
                {formulas.map((formula) => (
                  <SelectItem
                    key={formula.calculationId}
                    value={formula.resultKey}
                  >
                    {formula.resultKey}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!disabled && (
              <button
                className="flex h-7 items-center gap-1 rounded border px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={addTerm}
                type="button"
              >
                <Plus className="size-3" />
                New
              </button>
            )}
            {!disabled && selectedIndex !== null && (
              <button
                className="flex h-7 items-center gap-1 rounded border px-2 text-[10px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                onClick={() => deleteTerm(selectedIndex)}
                type="button"
              >
                <Trash2 className="size-3" />
                Delete
              </button>
            )}
          </div>
          {selectedFormula ? (
            <>
              {/* Term name row */}
              <div className="flex shrink-0 items-center gap-2 border-b bg-muted/10 px-3 py-2">
                <Input
                  className="h-6 w-20 font-mono text-xs"
                  disabled={disabled}
                  onChange={(e) =>
                    updateFormulaField("resultKey", e.target.value)
                  }
                  placeholder="KEY"
                  value={selectedFormula.resultKey}
                />
                <span className="select-none font-light text-muted-foreground text-sm">
                  =
                </span>
                <Input
                  className="h-6 flex-1 text-xs"
                  disabled={disabled}
                  onChange={(e) => updateFormulaField("label", e.target.value)}
                  placeholder="Label"
                  value={selectedFormula.label}
                />
              </div>

              {/* Formula tape */}
              <div className="shrink-0 border-b px-3 pt-3 pb-2">
                <div className="flex min-h-11 flex-wrap items-center gap-1 rounded-md border bg-background px-2 py-1.5">
                  {tokens.length === 0 ? (
                    <span className="select-none text-[11px] text-muted-foreground italic">
                      Formula is empty
                    </span>
                  ) : (
                    tokenItems.map(({ key, token }) => (
                      <TokenChip
                        key={key}
                        termKeys={allTermKeys}
                        token={token}
                        upstreamKeys={upstreamKeys}
                      />
                    ))
                  )}
                </div>

                {/* Operator keys */}
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {OPERATOR_KEYS.map(({ label, value }) => (
                    <button
                      className="flex h-7 min-w-7 select-none items-center justify-center rounded border bg-background px-1.5 font-mono font-semibold text-sm transition-colors hover:bg-muted disabled:opacity-40"
                      disabled={disabled}
                      key={value}
                      onClick={() => appendOp(value)}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                  <div className="ml-auto flex gap-1">
                    <button
                      className="flex h-7 items-center gap-1 rounded border bg-background px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
                      disabled={disabled || tokens.length === 0}
                      onClick={backspace}
                      type="button"
                    >
                      ⌫
                    </button>
                    <button
                      className="flex h-7 items-center gap-1 rounded border bg-background px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-40"
                      disabled={disabled || tokens.length === 0}
                      onClick={clearFormula}
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Builder tools */}
              <div className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
                {/* Special functions */}
                <div className="space-y-1.5">
                  <div className="font-bold text-[9px] text-violet-600/80 uppercase tracking-widest">
                    Functions
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {SPECIAL_FUNCTIONS.map(({ display, name }) => (
                      <button
                        className="select-none rounded border border-violet-400/40 bg-violet-400/10 px-2 py-0.5 font-mono text-[10px] text-violet-700 transition-colors hover:bg-violet-400/25 disabled:opacity-40 dark:text-violet-400"
                        disabled={disabled}
                        key={name}
                        onClick={() => appendFunc(name)}
                        title={name}
                        type="button"
                      >
                        {display}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Constant */}
                <div className="space-y-1.5">
                  <div className="font-bold text-[9px] text-amber-600/80 uppercase tracking-widest">
                    Constant
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Input
                      className="h-7 w-28 font-mono text-xs"
                      disabled={disabled}
                      onChange={(e) => setConstantInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && insertConstant()}
                      placeholder="e.g. 34400"
                      type="number"
                      value={constantInput}
                    />
                    <button
                      className="h-7 rounded border border-amber-400/40 bg-amber-400/10 px-2 font-semibold text-[10px] text-amber-700 transition-colors hover:bg-amber-400/25 disabled:opacity-40 dark:text-amber-400"
                      disabled={disabled || !constantInput.trim()}
                      onClick={insertConstant}
                      type="button"
                    >
                      Insert
                    </button>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 border-t pt-1">
                  {[
                    {
                      cls: "border-sky-400/40 bg-sky-400/10 text-sky-700",
                      label: "Upstream",
                    },
                    {
                      cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700",
                      label: "Term",
                    },
                    {
                      cls: "border-amber-400/40 bg-amber-400/10 text-amber-700",
                      label: "Constant",
                    },
                    {
                      cls: "border-violet-400/40 bg-violet-400/10 text-violet-700",
                      label: "Function",
                    },
                  ].map(({ cls, label }) => (
                    <div className="flex items-center gap-1" key={label}>
                      <span
                        className={`rounded border px-1.5 py-px font-mono text-[9px] ${cls}`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="select-none font-light font-mono text-3xl text-muted-foreground/40">
                ƒ(x)
              </div>
              <p className="max-w-40 text-muted-foreground text-xs">
                Select a term on the left or create a new one to edit its
                formula.
              </p>
              {!disabled && formulas.length === 0 && (
                <button
                  className="mt-1 flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs transition-colors hover:bg-muted"
                  onClick={addTerm}
                  type="button"
                >
                  <Plus className="size-3" />
                  Create first term
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CalculationEngineRunSections ─────────────────────────────────────────────

export function CalculationEngineRunSections({
  lastRunOutput,
  resolvedMode,
}: {
  lastRunOutput: Record<string, unknown>;
  resolvedMode?: string;
}) {
  const calculationSummary = asRecord(lastRunOutput.calculationSummary);
  const formulaTrace = asRecord(
    asRecord(lastRunOutput.formula_trace).formulaTrace
  );
  const calculatedResults = asRecord(
    asRecord(lastRunOutput.calculated_results).calculatedResults
  );
  const warnings = Array.isArray(lastRunOutput.warnings)
    ? (lastRunOutput.warnings as string[])
    : [];

  const mode =
    resolvedMode ||
    (calculationSummary.formulaMode as string | undefined) ||
    "auto";
  const modeLabel = getCalculationRunModeLabel(mode);

  const traceEntries = Object.entries(formulaTrace);
  const resultEntries = Object.entries(calculatedResults);

  return (
    <div className="space-y-3">
      <div className="space-y-2 rounded-md border bg-muted/20 p-3">
        <div className="font-medium text-sm">Run summary</div>
        <div className="divide-y rounded border bg-background/40 text-xs">
          {[
            { label: "Formula mode", value: modeLabel },
            {
              label: "Formulas evaluated",
              value: calculationSummary.calculatedCount ?? "–",
            },
            {
              label: "Input values",
              value: calculationSummary.inputCount ?? "–",
            },
            {
              label: "Rules used",
              value: calculationSummary.ruleCount ?? "–",
            },
            {
              label: "Warnings",
              value: calculationSummary.warningCount ?? "–",
            },
          ].map((row) => (
            <div
              className="grid grid-cols-[9rem_1fr] gap-2 px-2 py-1.5"
              key={row.label}
            >
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium">{String(row.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {resultEntries.length > 0 && (
        <div className="space-y-2 rounded-md border bg-muted/20 p-3">
          <div className="font-medium text-xs">Calculated results</div>
          <div className="divide-y rounded border bg-background/40 text-xs">
            {resultEntries.map(([key, value]) => (
              <div
                className="grid grid-cols-[9rem_1fr] gap-2 px-2 py-1.5"
                key={key}
              >
                <span className="font-mono text-muted-foreground">{key}</span>
                <span className="font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {traceEntries.length > 0 && (
        <div className="space-y-2 rounded-md border bg-muted/20 p-3">
          <div className="font-medium text-xs">Formula trace</div>
          <div className="space-y-1">
            {traceEntries.map(([key, traceValue]) => {
              const trace = asRecord(traceValue);
              const traceWarnings = Array.isArray(trace.warnings)
                ? (trace.warnings as string[])
                : [];
              return (
                <div
                  className="rounded border bg-background/60 p-2 text-[11px]"
                  key={key}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium font-mono">{key}</span>
                    <span className="font-medium">
                      = {String(trace.result ?? "–")}
                    </span>
                  </div>
                  <div className="mt-0.5 text-muted-foreground">
                    {String(trace.expression || trace.operation || "")}
                  </div>
                  {traceWarnings.length > 0 && (
                    <div className="mt-1 text-[10px] text-amber-600">
                      {traceWarnings.join("; ")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="space-y-1 rounded-md border border-amber-500/30 bg-amber-500/10 p-3">
          <div className="font-medium text-amber-700 text-xs">Warnings</div>
          {warnings.map((warning) => (
            <div
              className="text-[11px] text-amber-800 dark:text-amber-300"
              key={warning}
            >
              {warning}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
