import { Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import type { WorkflowEdge, WorkflowNode } from '@/shared/workflow-engine/state/workflow-store';
import type { WorkflowBlock } from '@/shared/workflow-engine/workflow/contracts';
import { availableCalculationValues } from './available-calculation-values';
import {
  CALCULATION_TOKEN_LEGEND,
  type CalculationMode,
  type DisplayToken,
  type InlineFormula,
  OPERATOR_KEYS,
  SPECIAL_FUNCTIONS,
  formulaToExpression,
  getFormulasFromConfig,
  getTokenItems,
  hasConnectedCalculationRuleSource,
  isValidNumericLiteral,
  tokenizeExpression,
  tokensToExpression,
} from './calculation-editor-model';
import { CalculationTokenChip } from './calculation-token-chip';
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
  const mode = (config.mode as CalculationMode | undefined) ?? 'auto';
  const formulas = getFormulasFromConfig(config);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tokens, setTokens] = useState<DisplayToken[]>([]);
  const [constantInput, setConstantInput] = useState('');
  const handledCreateRequestRef = useRef<number | undefined>(undefined);
  const handledInsertRequestRef = useRef<string | undefined>(undefined);

  const upstreamValues = availableCalculationValues(block, edges, nodes, lastRunOutput);
  const upstreamKeys = new Set(upstreamValues.map((v) => v.key));
  const allTermKeys = new Set(formulas.map((f) => f.resultKey));
  const tokenItems = getTokenItems(tokens);

  const selectedFormula = selectedIndex !== null ? (formulas[selectedIndex] ?? null) : null;

  const hasExternalRules = hasConnectedCalculationRuleSource(block, edges);

  // ── Persistence helpers ──────────────────────────────────────────────────────

  const saveFormulas = useCallback(
    (next: InlineFormula[]) => {
      onUpdateConfig('formulas', next);
    },
    [onUpdateConfig],
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
        operation: 'pass_through',
      };
      saveFormulas(next);
    },
    [formulas, saveFormulas, selectedIndex],
  );

  // ── Term selection ───────────────────────────────────────────────────────────

  const selectTerm = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      const formula = formulas[index];
      setTokens(tokenizeExpression(formulaToExpression(formula)));
      setConstantInput('');
      onSelectedTermIdChange?.(formula.resultKey);
    },
    [formulas, onSelectedTermIdChange],
  );

  // ── Token insertion ──────────────────────────────────────────────────────────

  const appendToken = useCallback(
    (token: DisplayToken) => {
      if (disabled) {
        return;
      }
      saveTokens([...tokens, token]);
    },
    [disabled, saveTokens, tokens],
  );

  const appendRef = useCallback(
    (key: string) => appendToken({ type: 'ref', value: key }),
    [appendToken],
  );

  const appendFunc = useCallback(
    (name: string) => {
      if (disabled) {
        return;
      }
      saveTokens([...tokens, { type: 'func', value: name }, { type: 'paren', value: '(' }]);
    },
    [disabled, saveTokens, tokens],
  );

  const appendOp = useCallback(
    (op: string) => {
      const isParenLike = op === '(' || op === ')';
      appendToken({ type: isParenLike ? 'paren' : 'op', value: op });
    },
    [appendToken],
  );

  const insertConstant = () => {
    if (!constantInput.trim()) {
      return;
    }
    const num = Number(constantInput);
    if (!isValidNumericLiteral(constantInput)) return;
    if (!Number.isFinite(num)) {
      return;
    }
    appendToken({ type: 'num', value: constantInput.trim() });
    setConstantInput('');
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

  const updateFormulaField = (field: 'resultKey' | 'label' | 'description', value: string) => {
    if (disabled || selectedIndex === null) {
      return;
    }
    const next = [...formulas];
    const updated = { ...next[selectedIndex], [field]: value };
    if (field === 'resultKey') {
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
      formulaExpression: '',
      label: id,
      operands: [],
      operation: 'pass_through',
      resultKey: id,
    };
    const next = [...formulas, newFormula];
    saveFormulas(next);
    const newIndex = next.length - 1;
    setSelectedIndex(newIndex);
    setTokens([]);
    setConstantInput('');
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
      (formula) => formula.resultKey === selectedTermId || formula.calculationId === selectedTermId,
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
    if (!insertRequest || insertRequest.id === handledInsertRequestRef.current) {
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
        <Select disabled={disabled} onValueChange={(v) => onUpdateConfig('mode', v)} value={mode}>
          <SelectTrigger className="h-6 flex-1 text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-xs" value="auto">
              Auto — {hasExternalRules ? 'using connected source' : 'using inline formulas'}
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
      <div className="overflow-hidden rounded-lg border" style={{ minHeight: 500 }}>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center gap-2 border-b bg-muted/20 px-3 py-2">
            <span className="shrink-0 font-semibold text-[9px] text-muted-foreground uppercase tracking-widest">
              Editing
            </span>
            <Select
              disabled={disabled || formulas.length === 0}
              onValueChange={(value) => {
                const index = formulas.findIndex((formula) => formula.resultKey === value);
                if (index >= 0) {
                  selectTerm(index);
                }
              }}
              value={selectedFormula?.resultKey || ''}
            >
              <SelectTrigger className="h-7 min-w-0 flex-1 text-xs">
                <SelectValue placeholder="Select a created term" />
              </SelectTrigger>
              <SelectContent>
                {formulas.map((formula) => (
                  <SelectItem key={formula.calculationId} value={formula.resultKey}>
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
                  onChange={(e) => updateFormulaField('resultKey', e.target.value)}
                  placeholder="KEY"
                  value={selectedFormula.resultKey}
                />
                <span className="select-none font-light text-muted-foreground text-sm">=</span>
                <Input
                  className="h-6 flex-1 text-xs"
                  disabled={disabled}
                  onChange={(e) => updateFormulaField('label', e.target.value)}
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
                      <CalculationTokenChip
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
                      onKeyDown={(e) => e.key === 'Enter' && insertConstant()}
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
                  {CALCULATION_TOKEN_LEGEND.map(({ cls, label }) => (
                    <div className="flex items-center gap-1" key={label}>
                      <span className={`rounded border px-1.5 py-px font-mono text-[9px] ${cls}`}>
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
                Select a term on the left or create a new one to edit its formula.
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
