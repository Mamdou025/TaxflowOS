import { Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TwoPanelToolShell } from '@/features/workflow-builder/ui/two-panel-tool-shell';
import { cn } from '@/lib/utils';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import type { WorkflowEdge, WorkflowNode } from '@/shared/workflow-engine/state/workflow-store';
import type { WorkflowBlock } from '@/shared/workflow-engine/workflow/contracts';
import { availableCalculationValues } from './available-calculation-values';
import {
  CALCULATION_TOKEN_LEGEND as LEGEND,
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
import { CalculationEngineRunSections } from './calculation-engine-run-sections';
import { CalculationSettings } from './calculation-settings';
import { CalculationSourcePicker, calculationSources } from './calculation-source-picker';
import { CalculationTokenChip } from './calculation-token-chip';

// A template's first edit creates a personal workflow and remounts the editor.
// Keep its selection through that transition without writing UI state to rules.
const selectedTerms = new Map<string, string>();
// ─── CalculationEngineEditor ──────────────────────────────────────────────────

export function CalculationEngineEditor({
  block,
  createTermRequest,
  inputContextBlock,
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
  inputContextBlock?: WorkflowBlock;
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
  const mode = (config.mode as CalculationMode | undefined) ?? 'auto';
  const formulas = getFormulasFromConfig(config);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    const key = selectedTermId ?? selectedTerms.get(block.id);
    const index = formulas.findIndex((formula) => formula.resultKey === key);
    return index >= 0 ? index : null;
  });
  const [tokens, setTokens] = useState<DisplayToken[]>(() =>
    selectedIndex === null ? [] : tokenizeExpression(formulaToExpression(formulas[selectedIndex])),
  );
  const [constantInput, setConstantInput] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'summary'>('edit');
  const handledCreateRequestRef = useRef<number | undefined>(undefined);
  const handledInsertRequestRef = useRef<string | undefined>(undefined);

  const upstreamValues = availableCalculationValues(
    inputContextBlock ?? block,
    edges,
    nodes,
    lastRunOutput,
  );
  const upstreamKeys = new Set(upstreamValues.map((v) => v.key));
  const allTermKeys = new Set(formulas.map((f) => f.resultKey));
  const tokenItems = getTokenItems(tokens);
  const selectedFormula = selectedIndex !== null ? (formulas[selectedIndex] ?? null) : null;
  const hasExternalRules = hasConnectedCalculationRuleSource(block, edges);

  const saveFormulas = useCallback(
    (next: InlineFormula[]) => onUpdateConfig('formulas', next),
    [onUpdateConfig],
  );

  const saveTokens = useCallback(
    (nextTokens: DisplayToken[]) => {
      if (selectedIndex === null) return;
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

  const selectTerm = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      const formula = formulas[index];
      selectedTerms.set(block.id, formula.resultKey);
      setTokens(tokenizeExpression(formulaToExpression(formula)));
      setConstantInput('');
      onSelectedTermIdChange?.(formula.resultKey);
    },
    [block.id, formulas, onSelectedTermIdChange],
  );

  const appendToken = useCallback(
    (token: DisplayToken) => {
      if (!disabled) saveTokens([...tokens, token]);
    },
    [disabled, saveTokens, tokens],
  );
  const appendRef = useCallback(
    (key: string) => appendToken({ type: 'ref', value: key }),
    [appendToken],
  );
  const appendFunc = useCallback(
    (name: string) => {
      if (!disabled)
        saveTokens([...tokens, { type: 'func', value: name }, { type: 'paren', value: '(' }]);
    },
    [disabled, saveTokens, tokens],
  );
  const appendOp = useCallback(
    (op: string) => appendToken({ type: op === '(' || op === ')' ? 'paren' : 'op', value: op }),
    [appendToken],
  );

  const insertConstant = () => {
    if (!constantInput.trim()) return;
    const num = Number(constantInput);
    if (!isValidNumericLiteral(constantInput)) return;
    if (!Number.isFinite(num)) return;
    appendToken({ type: 'num', value: constantInput.trim() });
    setConstantInput('');
  };

  const backspace = () => {
    if (!disabled && tokens.length > 0) saveTokens(tokens.slice(0, -1));
  };
  const clearFormula = () => {
    if (!disabled) saveTokens([]);
  };

  const updateFormulaField = (
    field: 'resultKey' | 'label' | 'description' | 'roundingDigits' | 'unit',
    value: string | number | undefined,
  ) => {
    if (disabled || selectedIndex === null) return;
    const next = [...formulas];
    const updated = { ...next[selectedIndex], [field]: value };
    if (field === 'resultKey' && typeof value === 'string') {
      selectedTerms.set(block.id, value);
      updated.calculationId = value;
      onSelectedTermIdChange?.(value);
    }
    next[selectedIndex] = updated;
    saveFormulas(next);
  };

  const addTerm = useCallback(() => {
    if (disabled) return;
    let nextNumber = formulas.length + 1;
    while (formulas.some((formula) => formula.resultKey === `TERM_${nextNumber}`)) nextNumber++;
    const id = `TERM_${nextNumber}`;
    const newFormula: InlineFormula = {
      calculationId: id,
      formulaExpression: '',
      label: id,
      operands: [],
      operation: 'pass_through',
      resultKey: id,
    };
    const next = [...formulas, newFormula];
    selectedTerms.set(block.id, id);
    saveFormulas(next);
    const newIndex = next.length - 1;
    setSelectedIndex(newIndex);
    setTokens([]);
    setConstantInput('');
    onSelectedTermIdChange?.(id);
  }, [block.id, disabled, formulas, onSelectedTermIdChange, saveFormulas]);

  const deleteTerm = (index: number) => {
    if (disabled) return;
    const next = formulas.filter((_, i) => i !== index);
    saveFormulas(next);
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setTokens([]);
      onSelectedTermIdChange?.(null);
    } else if (selectedIndex !== null && selectedIndex > index) setSelectedIndex(selectedIndex - 1);
  };

  useEffect(() => {
    if (!selectedTermId) return;
    const index = formulas.findIndex(
      (f) => f.resultKey === selectedTermId || f.calculationId === selectedTermId,
    );
    if (index >= 0 && index !== selectedIndex) selectTerm(index);
  }, [formulas, selectedIndex, selectedTermId, selectTerm]);

  useEffect(() => {
    if (
      createTermRequest === undefined ||
      createTermRequest <= 0 ||
      createTermRequest === handledCreateRequestRef.current
    )
      return;
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
        <Select disabled={disabled} onValueChange={(v) => onUpdateConfig('mode', v)} value={mode}>
          <SelectTrigger className="h-7 w-full text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-xs" value="auto">
              Auto — {hasExternalRules ? 'connected source' : 'inline formulas'}
            </SelectItem>
            <SelectItem className="text-xs" value="inline">
              Inline formulas
            </SelectItem>
            <SelectItem className="text-xs" value="external_rules">
              External rules
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Term list */}
      <div className="flex-1 overflow-y-auto">
        {formulas.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="select-none font-light font-mono text-2xl text-muted-foreground/30">
              ƒ(x)
            </span>
            <p className="text-[11px] text-muted-foreground">No terms yet</p>
          </div>
        ) : (
          formulas.map((formula, index) => {
            const preview = formulaToExpression(formula);
            const isSelected = selectedIndex === index;
            return (
              <button
                className={cn(
                  'group flex w-full flex-col items-start gap-0.5 border-b px-3 py-2.5 text-left transition-colors hover:bg-muted/50',
                  isSelected && 'bg-muted/70',
                )}
                key={formula.calculationId}
                onClick={() => selectTerm(index)}
                type="button"
              >
                <div className="flex w-full items-center justify-between gap-1">
                  <span className="truncate font-mono font-medium text-xs">
                    {formula.resultKey}
                  </span>
                  {!disabled && (
                    <button
                      className="invisible shrink-0 rounded p-0.5 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive group-hover:visible"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTerm(index);
                      }}
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
        {(['edit', 'summary'] as const).map((tab) => (
          <button
            className={cn(
              'px-4 py-2 text-xs font-medium transition-colors',
              activeTab === tab
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab === 'edit' ? 'Edit' : 'Summary'}
          </button>
        ))}
      </div>

      {/* Edit tab */}
      {activeTab === 'edit' && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {selectedFormula ? (
            <>
              {/* Term name row */}
              <div className="flex shrink-0 items-center gap-2 border-b bg-muted/10 px-3 py-2">
                <Input
                  className="h-6 w-24 font-mono text-xs"
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
                <div className="flex flex-wrap gap-3 text-xs">
                  <label>
                    Round this term{' '}
                    <select
                      aria-label="Term rounding"
                      disabled={disabled}
                      value={selectedFormula.roundingDigits ?? ''}
                      onChange={(event) =>
                        updateFormulaField(
                          'roundingDigits',
                          event.target.value === '' ? undefined : Number(event.target.value),
                        )
                      }
                    >
                      <option value="">Keep full precision</option>
                      {Array.from({ length: 16 }, (_, i) => (
                        <option key={i} value={i}>
                          {i} decimal places
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Unit{' '}
                    <input
                      aria-label="Result unit"
                      placeholder="e.g. kg, CAD, units"
                      value={selectedFormula.unit ?? ''}
                      disabled={disabled}
                      onChange={(event) => updateFormulaField('unit', event.target.value)}
                    />
                  </label>
                </div>
                <div className="flex min-h-11 flex-wrap items-center gap-1 rounded-md border bg-background px-2 py-1.5">
                  {tokens.length === 0 ? (
                    <span className="select-none text-[11px] text-muted-foreground italic">
                      Formula is empty
                    </span>
                  ) : (
                    tokenItems.map(({ key, token }) => (
                      <CalculationTokenChip
                        sourceLabels={
                          new Map(nodes.map((node) => [node.id, node.data.block?.label ?? node.id]))
                        }
                        key={key}
                        termKeys={allTermKeys}
                        token={token}
                        upstreamKeys={upstreamKeys}
                      />
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

              {/* Constant */}
              <div className="shrink-0 space-y-1.5 border-b px-3 py-2">
                <div className="font-bold text-[9px] text-amber-600/80 uppercase tracking-widest">
                  Add a number
                </div>
                <div className="flex items-center gap-1.5">
                  <Input
                    className="h-7 w-28 font-mono text-xs"
                    disabled={disabled}
                    onChange={(e) => setConstantInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && insertConstant()}
                    aria-label="Number to add"
                    step="any"
                    placeholder="e.g. 500 or 2"
                    type="number"
                    value={constantInput}
                  />
                  <button
                    className="h-7 rounded border border-amber-400/40 bg-amber-400/10 px-2 font-semibold text-[10px] text-amber-700 transition-colors hover:bg-amber-400/25 disabled:opacity-40 dark:text-amber-400"
                    disabled={disabled || !isValidNumericLiteral(constantInput)}
                    onClick={insertConstant}
                    type="button"
                  >
                    Add number
                  </button>
                </div>
              </div>

              {/* Builder tools */}
              <div className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
                <CalculationSourcePicker
                  sources={calculationSources(inputContextBlock ?? block, edges, nodes)}
                  outputs={lastRunOutput}
                  disabled={disabled}
                  onInsert={appendRef}
                />
                {/* Upstream keys */}
                {upstreamValues.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="font-bold text-[9px] text-sky-600/80 uppercase tracking-widest">
                      Upstream values
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {upstreamValues.map(({ key, value }) => (
                        <button
                          className="flex select-none items-center gap-1 rounded border border-sky-400/40 bg-sky-400/10 px-2 py-0.5 font-mono text-[10px] text-sky-700 transition-colors hover:bg-sky-400/25 disabled:opacity-40 dark:text-sky-400"
                          disabled={disabled}
                          key={key}
                          onClick={() => appendRef(key)}
                          title={
                            value !== null
                              ? String(value)
                              : 'Awaiting data — you can use this term now'
                          }
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
                    <div className="font-bold text-[9px] text-emerald-600/80 uppercase tracking-widest">
                      Other terms
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formulas
                        .filter((_, i) => i !== selectedIndex)
                        .map((f) => (
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

                {/* Legend */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 border-t pt-2">
                  {LEGEND.map(({ cls, label }) => (
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
      )}

      {/* Summary tab */}
      {activeTab === 'summary' && (
        <div className="flex-1 overflow-y-auto p-3">
          <CalculationEngineRunSections lastRunOutput={lastRunOutput} />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        fill ? 'h-full' : 'h-[560px]',
        'flex flex-col overflow-hidden rounded-md border',
      )}
    >
      <CalculationSettings config={config} disabled={disabled} onChange={onUpdateConfig} />
      <div className="min-h-0 flex-1">
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
    </div>
  );
}
