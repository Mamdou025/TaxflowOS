"use client";

import { cn } from "@/lib/utils";
import type { WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";
import type { WorkflowEdge, WorkflowNode } from "@/shared/workflow-engine/state/workflow-store";
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
import { TwoPanelToolShell } from "@/features/workflow-builder/ui/two-panel-tool-shell";
import {
  type InlineFormula,
  CalculationEngineRunSections,
} from "./calculation-engine-panel";

// ─── Re-exported helpers (keep in sync with calculation-engine-panel) ─────────

type CalculationMode = "auto" | "inline" | "external_rules";

type DisplayToken =
  | { type: "ref"; value: string }
  | { type: "op"; value: string }
  | { type: "num"; value: string }
  | { type: "func"; value: string }
  | { type: "paren"; value: string };

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
  if (character === ",") return { type: "op", value: "," };
  if (OPERATOR_TOKENS.has(character)) return { type: "op", value: character };
  return null;
}

function readNumberToken(expression: string, startIndex: number) {
  let endIndex = startIndex + 1;
  while (endIndex < expression.length && NUMBER_CHARACTER_REGEX.test(expression[endIndex])) {
    endIndex += 1;
  }
  return {
    nextIndex: endIndex,
    token: { type: "num" as const, value: expression.slice(startIndex, endIndex) },
  };
}

function readIdentifierToken(expression: string, startIndex: number) {
  let endIndex = startIndex + 1;
  while (endIndex < expression.length && IDENTIFIER_CHARACTER_REGEX.test(expression[endIndex])) {
    endIndex += 1;
  }
  const word = expression.slice(startIndex, endIndex);
  return {
    nextIndex: endIndex,
    token: {
      type: (KNOWN_FUNCTIONS.has(word) ? "func" : "ref") as "func" | "ref",
      value: word,
    },
  };
}

function getTokenAt(expression: string, index: number) {
  const character = expression[index];
  if (WHITESPACE_CHARACTER_REGEX.test(character)) return { nextIndex: index + 1, token: null };
  const singleChar = getSingleCharacterToken(character);
  if (singleChar) return { nextIndex: index + 1, token: singleChar };
  if (DIGIT_CHARACTER_REGEX.test(character) || (character === "." && DIGIT_CHARACTER_REGEX.test(expression[index + 1] ?? ""))) {
    return readNumberToken(expression, index);
  }
  if (IDENTIFIER_START_REGEX.test(character)) return readIdentifierToken(expression, index);
  return { nextIndex: index + 1, token: null };
}

function tokenizeExpression(expression: string): DisplayToken[] {
  const tokens: DisplayToken[] = [];
  let i = 0;
  while (i < expression.length) {
    const { nextIndex, token } = getTokenAt(expression, i);
    if (token) tokens.push(token);
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
  if (formula.formulaExpression?.trim()) return formula.formulaExpression.trim();
  const ops = formula.operands.map(String);
  switch (formula.operation) {
    case "pass_through": return ops[0] ?? "";
    case "add": return ops.join(" + ");
    case "subtract": return ops.length > 1 ? `${ops[0]} - ${ops.slice(1).join(" - ")}` : (ops[0] ?? "");
    case "multiply": return ops.join(" * ");
    case "divide": return ops.length > 1 ? `${ops[0]} / ${ops.slice(1).join(" / ")}` : (ops[0] ?? "");
    default: return ops.length > 0 ? `${formula.operation}(${ops.join(", ")})` : "";
  }
}

function getFormulasFromConfig(config: Record<string, unknown>): InlineFormula[] {
  const raw = config.formulas ?? config.calculationRules ?? config.inlineFormulas;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is InlineFormula =>
      typeof item === "object" && item !== null && typeof (item as InlineFormula).calculationId === "string"
  );
}

function hasConnectedCalculationRuleSource(block: WorkflowBlock, edges: WorkflowEdge[]) {
  return edges.some(
    (edge) =>
      edge.target === block.id &&
      (edge.data?.targetInputRole === "calculation_rules" ||
        edge.data?.workflowEdge?.targetInputRole === "calculation_rules")
  );
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

const UPSTREAM_VALUE_GROUP_KEYS = ["namedValues", "named_values", "categoryTotals", "rollupTotals", "fapiInputs", "calculatedResults"];
const FALLBACK_VALUE_KEYS = ["fatPaid", "rtf", "inclusionRate", "fxRate"];

function isCalculationInputRole(role?: string) {
  return role === "named_values" || role === "fapi_inputs" || role === "protected_inputs";
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
    if (!sourceNode) continue;
    const sourceBlock = sourceNode.data.block;
    const role = edge.data?.targetInputRole ?? edge.data?.workflowEdge?.targetInputRole;
    if (!isCalculationInputRole(role)) continue;
    const sourceOutput = asRecord(lastOutput[edge.source] ?? lastOutput[sourceBlock?.id ?? ""] ?? {});
    for (const key of UPSTREAM_VALUE_GROUP_KEYS) {
      const group = asRecord(sourceOutput[key]);
      for (const [valueKey, value] of Object.entries(group)) {
        if (!seen.has(valueKey)) {
          seen.add(valueKey);
          result.push({ key: valueKey, value: asNumber(value) });
        }
      }
    }
  }

  for (const key of FALLBACK_VALUE_KEYS) {
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ key, value: null });
    }
  }

  return result;
}

// ─── Token chip ───────────────────────────────────────────────────────────────

function TokenChip({ termKeys, token, upstreamKeys }: { termKeys: Set<string>; token: DisplayToken; upstreamKeys: Set<string> }) {
  const operatorLabels: Record<string, string> = { "*": "×", "-": "−", "/": "÷" };
  const displayValue = operatorLabels[token.value] ?? token.value;

  if (token.type === "op") return <span className="inline-flex select-none items-center rounded px-1.5 py-0.5 font-bold font-mono text-foreground/60 text-xs">{displayValue}</span>;
  if (token.type === "paren") return <span className="inline-flex select-none items-center rounded px-1 py-0.5 font-mono text-muted-foreground text-xs">{token.value}</span>;
  if (token.type === "num") return <span className="inline-flex items-center rounded border border-amber-400/50 bg-amber-400/15 px-1.5 py-0.5 font-mono text-[11px] text-amber-700 dark:text-amber-400">{token.value}</span>;
  if (token.type === "func") return <span className="inline-flex items-center rounded border border-violet-400/50 bg-violet-400/15 px-1.5 py-0.5 font-mono text-[11px] text-violet-700 dark:text-violet-400">{token.value}</span>;
  if (termKeys.has(token.value)) return <span className="inline-flex items-center rounded border border-emerald-400/50 bg-emerald-400/15 px-1.5 py-0.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">{token.value}</span>;
  if (upstreamKeys.has(token.value)) return <span className="inline-flex items-center rounded border border-sky-400/50 bg-sky-400/15 px-1.5 py-0.5 font-mono text-[11px] text-sky-700 dark:text-sky-400">{token.value}</span>;
  return <span className="inline-flex items-center rounded border border-muted-foreground/30 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-foreground">{token.value}</span>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

const LEGEND = [
  { cls: "border-sky-400/40 bg-sky-400/10 text-sky-700", label: "Upstream" },
  { cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700", label: "Term" },
  { cls: "border-amber-400/40 bg-amber-400/10 text-amber-700", label: "Constant" },
  { cls: "border-violet-400/40 bg-violet-400/10 text-violet-700", label: "Function" },
] as const;

// ─── CalculationEngineEditor ──────────────────────────────────────────────────

export function CalculationEngineEditor({
  block,
  createTermRequest,
  disabled,
  edges,
  fill,
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
  fill?: boolean;
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
  const [activeTab, setActiveTab] = useState<"edit" | "summary">("edit");
  const handledCreateRequestRef = useRef<number | undefined>(undefined);
  const handledInsertRequestRef = useRef<string | undefined>(undefined);

  const upstreamValues = collectUpstreamValues(block, edges, nodes, lastRunOutput);
  const upstreamKeys = new Set(upstreamValues.map((v) => v.key));
  const allTermKeys = new Set(formulas.map((f) => f.resultKey));
  const tokenItems = getTokenItems(tokens);
  const selectedFormula = selectedIndex !== null ? (formulas[selectedIndex] ?? null) : null;
  const hasExternalRules = hasConnectedCalculationRuleSource(block, edges);

  const saveFormulas = useCallback(
    (next: InlineFormula[]) => onUpdateConfig("formulas", next),
    [onUpdateConfig]
  );

  const saveTokens = useCallback(
    (nextTokens: DisplayToken[]) => {
      if (selectedIndex === null) return;
      setTokens(nextTokens);
      const expression = tokensToExpression(nextTokens);
      const next = [...formulas];
      next[selectedIndex] = { ...next[selectedIndex], formulaExpression: expression, operands: [], operation: "pass_through" };
      saveFormulas(next);
    },
    [formulas, saveFormulas, selectedIndex]
  );

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

  const appendToken = useCallback(
    (token: DisplayToken) => { if (!disabled) saveTokens([...tokens, token]); },
    [disabled, saveTokens, tokens]
  );
  const appendRef = useCallback((key: string) => appendToken({ type: "ref", value: key }), [appendToken]);
  const appendFunc = useCallback(
    (name: string) => { if (!disabled) saveTokens([...tokens, { type: "func", value: name }, { type: "paren", value: "(" }]); },
    [disabled, saveTokens, tokens]
  );
  const appendOp = useCallback(
    (op: string) => appendToken({ type: op === "(" || op === ")" ? "paren" : "op", value: op }),
    [appendToken]
  );

  const insertConstant = () => {
    if (!constantInput.trim()) return;
    const num = Number.parseFloat(constantInput);
    if (!Number.isFinite(num)) return;
    appendToken({ type: "num", value: constantInput.trim() });
    setConstantInput("");
  };

  const backspace = () => { if (!disabled && tokens.length > 0) saveTokens(tokens.slice(0, -1)); };
  const clearFormula = () => { if (!disabled) saveTokens([]); };

  const updateFormulaField = (field: "resultKey" | "label" | "description", value: string) => {
    if (disabled || selectedIndex === null) return;
    const next = [...formulas];
    const updated = { ...next[selectedIndex], [field]: value };
    if (field === "resultKey") { updated.calculationId = value; onSelectedTermIdChange?.(value); }
    next[selectedIndex] = updated;
    saveFormulas(next);
  };

  const addTerm = useCallback(() => {
    if (disabled) return;
    const id = `TERM_${formulas.length + 1}`;
    const newFormula: InlineFormula = { calculationId: id, formulaExpression: "", label: id, operands: [], operation: "pass_through", resultKey: id };
    const next = [...formulas, newFormula];
    saveFormulas(next);
    const newIndex = next.length - 1;
    setSelectedIndex(newIndex);
    setTokens([]);
    setConstantInput("");
    onSelectedTermIdChange?.(id);
  }, [disabled, formulas, onSelectedTermIdChange, saveFormulas]);

  const deleteTerm = (index: number) => {
    if (disabled) return;
    const next = formulas.filter((_, i) => i !== index);
    saveFormulas(next);
    if (selectedIndex === index) { setSelectedIndex(null); setTokens([]); onSelectedTermIdChange?.(null); }
    else if (selectedIndex !== null && selectedIndex > index) setSelectedIndex(selectedIndex - 1);
  };

  useEffect(() => {
    if (!selectedTermId) return;
    const index = formulas.findIndex((f) => f.resultKey === selectedTermId || f.calculationId === selectedTermId);
    if (index >= 0 && index !== selectedIndex) selectTerm(index);
  }, [formulas, selectedIndex, selectedTermId, selectTerm]);

  useEffect(() => {
    if (createTermRequest === undefined || createTermRequest <= 0 || createTermRequest === handledCreateRequestRef.current) return;
    handledCreateRequestRef.current = createTermRequest;
    addTerm();
  }, [addTerm, createTermRequest]);

  useEffect(() => {
    if (!insertRequest || insertRequest.id === handledInsertRequestRef.current) return;
    handledInsertRequestRef.current = insertRequest.id;
    appendRef(insertRequest.key);
  }, [appendRef, insertRequest]);

  // ─── Left panel: term index ───────────────────────────────────────────────

  const leftPanel = (
    <div className="flex h-full flex-col">
      {/* Mode selector */}
      <div className="shrink-0 border-b px-3 py-2">
        <Select disabled={disabled} onValueChange={(v) => onUpdateConfig("mode", v)} value={mode}>
          <SelectTrigger className="h-7 w-full text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-xs" value="auto">
              Auto — {hasExternalRules ? "connected source" : "inline formulas"}
            </SelectItem>
            <SelectItem className="text-xs" value="inline">Inline formulas</SelectItem>
            <SelectItem className="text-xs" value="external_rules">External rules</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Term list */}
      <div className="flex-1 overflow-y-auto">
        {formulas.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="select-none font-light font-mono text-2xl text-muted-foreground/30">ƒ(x)</span>
            <p className="text-[11px] text-muted-foreground">No terms yet</p>
          </div>
        ) : (
          formulas.map((formula, index) => {
            const preview = formulaToExpression(formula);
            const isSelected = selectedIndex === index;
            return (
              <button
                className={cn(
                  "group flex w-full flex-col items-start gap-0.5 border-b px-3 py-2.5 text-left transition-colors hover:bg-muted/50",
                  isSelected && "bg-muted/70"
                )}
                key={formula.calculationId}
                onClick={() => selectTerm(index)}
                type="button"
              >
                <div className="flex w-full items-center justify-between gap-1">
                  <span className="truncate font-mono font-medium text-xs">{formula.resultKey}</span>
                  {!disabled && (
                    <button
                      className="invisible shrink-0 rounded p-0.5 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive group-hover:visible"
                      onClick={(e) => { e.stopPropagation(); deleteTerm(index); }}
                      title="Delete term"
                      type="button"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  )}
                </div>
                <span className="truncate text-[10px] text-muted-foreground">
                  {preview || <em>empty</em>}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Add term */}
      {!disabled && (
        <div className="shrink-0 border-t px-3 py-2">
          <button
            className="flex w-full items-center justify-center gap-1.5 rounded border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={addTerm}
            type="button"
          >
            <Plus className="size-3" />
            New term
          </button>
        </div>
      )}
    </div>
  );

  // ─── Right panel: Edit | Summary tabs ────────────────────────────────────

  const rightPanel = (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b bg-muted/10">
        {(["edit", "summary"] as const).map((tab) => (
          <button
            className={cn(
              "px-4 py-2 text-xs font-medium transition-colors",
              activeTab === tab
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab === "edit" ? "Edit" : "Summary"}
          </button>
        ))}
      </div>

      {/* Edit tab */}
      {activeTab === "edit" && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {selectedFormula ? (
            <>
              {/* Term name row */}
              <div className="flex shrink-0 items-center gap-2 border-b bg-muted/10 px-3 py-2">
                <Input
                  className="h-6 w-24 font-mono text-xs"
                  disabled={disabled}
                  onChange={(e) => updateFormulaField("resultKey", e.target.value)}
                  placeholder="KEY"
                  value={selectedFormula.resultKey}
                />
                <span className="select-none font-light text-muted-foreground text-sm">=</span>
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
                    <span className="select-none text-[11px] text-muted-foreground italic">Formula is empty</span>
                  ) : (
                    tokenItems.map(({ key, token }) => (
                      <TokenChip key={key} termKeys={allTermKeys} token={token} upstreamKeys={upstreamKeys} />
                    ))
                  )}
                </div>
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
                    <button className="flex h-7 items-center gap-1 rounded border bg-background px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40" disabled={disabled || tokens.length === 0} onClick={backspace} type="button">⌫</button>
                    <button className="flex h-7 items-center gap-1 rounded border bg-background px-2 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:opacity-40" disabled={disabled || tokens.length === 0} onClick={clearFormula} type="button">Clear</button>
                  </div>
                </div>
              </div>

              {/* Builder tools */}
              <div className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
                {/* Upstream keys */}
                {upstreamValues.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="font-bold text-[9px] text-sky-600/80 uppercase tracking-widest">Upstream values</div>
                    <div className="flex flex-wrap gap-1">
                      {upstreamValues.map(({ key, value }) => (
                        <button
                          className="flex select-none items-center gap-1 rounded border border-sky-400/40 bg-sky-400/10 px-2 py-0.5 font-mono text-[10px] text-sky-700 transition-colors hover:bg-sky-400/25 disabled:opacity-40 dark:text-sky-400"
                          disabled={disabled}
                          key={key}
                          onClick={() => appendRef(key)}
                          title={value !== null ? String(value) : "no value from last run"}
                          type="button"
                        >
                          {key}
                          {value !== null && <span className="text-sky-500/70">= {value}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other terms */}
                {formulas.filter((_, i) => i !== selectedIndex).length > 0 && (
                  <div className="space-y-1.5">
                    <div className="font-bold text-[9px] text-emerald-600/80 uppercase tracking-widest">Other terms</div>
                    <div className="flex flex-wrap gap-1">
                      {formulas.filter((_, i) => i !== selectedIndex).map((f) => (
                        <button
                          className="select-none rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] text-emerald-700 transition-colors hover:bg-emerald-400/25 disabled:opacity-40 dark:text-emerald-400"
                          disabled={disabled}
                          key={f.calculationId}
                          onClick={() => appendRef(f.resultKey)}
                          type="button"
                        >
                          {f.resultKey}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Functions */}
                <div className="space-y-1.5">
                  <div className="font-bold text-[9px] text-violet-600/80 uppercase tracking-widest">Functions</div>
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
                  <div className="font-bold text-[9px] text-amber-600/80 uppercase tracking-widest">Constant</div>
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
                <div className="flex flex-wrap gap-x-3 gap-y-1 border-t pt-2">
                  {LEGEND.map(({ cls, label }) => (
                    <div className="flex items-center gap-1" key={label}>
                      <span className={`rounded border px-1.5 py-px font-mono text-[9px] ${cls}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="select-none font-light font-mono text-3xl text-muted-foreground/40">ƒ(x)</div>
              <p className="max-w-40 text-muted-foreground text-xs">Select a term on the left or create a new one to edit its formula.</p>
              {!disabled && formulas.length === 0 && (
                <button className="mt-1 flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs transition-colors hover:bg-muted" onClick={addTerm} type="button">
                  <Plus className="size-3" />
                  Create first term
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary tab */}
      {activeTab === "summary" && (
        <div className="flex-1 overflow-y-auto p-3">
          <CalculationEngineRunSections lastRunOutput={lastRunOutput} />
        </div>
      )}
    </div>
  );

  return (
    <div className={cn(fill ? "h-full" : "h-[560px]", "overflow-hidden rounded-md border")}>
      <TwoPanelToolShell
        badge="Logic"
        badgeVariant="logic"
        defaultLeftPercent={30}
        leftPanel={leftPanel}
        minLeftPx={180}
        rightPanel={rightPanel}
        title="Calculation Engine"
      />
    </div>
  );
}
