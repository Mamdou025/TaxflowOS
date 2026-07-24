"use client";

import { Plus, Trash2 } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";
import { AggregationRulesOverview } from "./aggregation-rules-overview";

type SplitRuleEditorProps = {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
  onCreateSourceVersion: () => void;
  onSelectedRulebookItemChange?: (itemId: string) => void;
  selectedRulebookItemId?: string;
  showRulebookOverview?: boolean;
  sourceLocked: boolean;
  sourceUsedInRun: boolean;
  sourceVersion: number;
};

type RollupRule = {
  description?: string;
  includeCategoryIds: string[];
  label: string;
  operation: "sum" | "sum_abs";
  rollupId: string;
};

type CalculationRule = {
  calculationId: string;
  description?: string;
  formulaExpression?: string;
  label: string;
  operands: Array<number | string>;
  operation:
    | "abs"
    | "add"
    | "divide"
    | "max"
    | "max_subtract_zero"
    | "min"
    | "min_multiply_cap"
    | "multiply"
    | "pass_through"
    | "round"
    | "subtract";
  resultKey: string;
};

const CALCULATION_OPERATIONS: CalculationRule["operation"][] = [
  "add",
  "subtract",
  "multiply",
  "divide",
  "min",
  "max",
  "pass_through",
  "round",
  "abs",
  "max_subtract_zero",
  "min_multiply_cap",
];
const LIST_SPLIT_REGEX = /[,;\n|]/;
const FORMULA_REFERENCE_REGEX = /\b[A-Za-z_][A-Za-z0-9_:.@-]*\b/g;
const FORMULA_TOKEN_SPLIT_REGEX = /\s+/;
const FORMULA_FUNCTION_NAMES = new Set([
  "abs",
  "max",
  "max_subtract_zero",
  "min",
  "min_multiply_cap",
  "round",
]);
const COMMON_CALCULATION_TERMS = [
  "income_bucket",
  "expense_bucket",
  "FAT_PAID",
  "RTF",
  "FX_RATE",
  "inclusionRate",
  "capGains",
  "debtForgiveness",
  "priorYearG",
  "cfaIncome",
];
const ROLLUP_CATEGORY_SELECTION_PREFIX = "__rollup_category__:";
export const NEW_ROLLUP_RULE_ID = "__new_rollup_rule__";
export const NEW_CALCULATION_RULE_ID = "__new_calculation_rule__";

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(LIST_SPLIT_REGEX)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function uniqueStrings(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean))
  );
}

function humanizeId(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRollupCategorySelectionId(categoryId: string) {
  return `${ROLLUP_CATEGORY_SELECTION_PREFIX}${categoryId}`;
}

function getSelectedRollupCategoryId(selection?: string) {
  return selection?.startsWith(ROLLUP_CATEGORY_SELECTION_PREFIX)
    ? selection.slice(ROLLUP_CATEGORY_SELECTION_PREFIX.length)
    : "";
}

function parseOperand(value: string) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && value.trim() !== ""
    ? numericValue
    : value.trim();
}

function formatOperand(value: number | string) {
  return String(value);
}

function getCalculationRuleId(rule: CalculationRule) {
  return rule.calculationId || rule.resultKey;
}

function getDefaultRollupRule(index: number): RollupRule {
  return {
    description: "",
    includeCategoryIds: [],
    label: "New Rollup",
    operation: "sum",
    rollupId: `rollup_${index + 1}`,
  };
}

function getDefaultCalculationRule(index: number): CalculationRule {
  return {
    calculationId: `calc_${index + 1}`,
    description: "",
    formulaExpression: "",
    label: "New Calculation",
    operands: [],
    operation: "add",
    resultKey: `CALC_${index + 1}`,
  };
}

function getFormulaReferences(expression?: string) {
  return uniqueStrings(
    Array.from(expression?.matchAll(FORMULA_REFERENCE_REGEX) || [])
      .map((match) => match[0])
      .filter((term) => !FORMULA_FUNCTION_NAMES.has(term.toLowerCase()))
  );
}

function getCalculationOperandOptions(
  rules: CalculationRule[],
  selectedRuleId?: string
) {
  return uniqueStrings([
    ...COMMON_CALCULATION_TERMS,
    ...rules.flatMap((rule) => {
      const ruleId = getCalculationRuleId(rule);
      const operands = rule.operands
        .filter((operand) => typeof operand === "string")
        .map(String);
      const formulaRefs = getFormulaReferences(rule.formulaExpression);
      return ruleId === selectedRuleId
        ? [...operands, ...formulaRefs]
        : [rule.resultKey, rule.calculationId, ...operands, ...formulaRefs];
    }),
  ]);
}

function getOperationFormulaExpression(rule: CalculationRule) {
  if (rule.formulaExpression?.trim()) {
    return rule.formulaExpression;
  }
  const operands = rule.operands.map(formatOperand);
  if (operands.length === 0) {
    return "";
  }
  if (rule.operation === "add") {
    return operands.join(" + ");
  }
  if (rule.operation === "subtract") {
    return operands.join(" - ");
  }
  if (rule.operation === "multiply") {
    return operands.join(" * ");
  }
  if (rule.operation === "divide") {
    return operands.join(" / ");
  }
  if (rule.operation === "pass_through") {
    return operands[0] || "";
  }
  return `${rule.operation}(${operands.join(", ")})`;
}

function appendFormulaToken(expression: string, token: string) {
  const current = expression.trim();
  if (!current) {
    return token;
  }
  if (token === ")" || token === ",") {
    return `${current}${token}`;
  }
  if (current.endsWith("(")) {
    return `${current}${token}`;
  }
  return `${current} ${token}`;
}

function removeLastFormulaToken(expression: string) {
  const trimmed = expression.trim();
  if (!trimmed) {
    return "";
  }
  const parts = trimmed.split(FORMULA_TOKEN_SPLIT_REGEX);
  return parts.slice(0, -1).join(" ");
}

function getExpressionOperationHint(expression: string) {
  if (expression.includes("/")) {
    return "divide";
  }
  if (expression.includes("*")) {
    return "multiply";
  }
  if (expression.includes("-")) {
    return "subtract";
  }
  return "add";
}

function getRollupRules(config: Record<string, unknown>): RollupRule[] {
  for (const key of ["rollupRules", "rollup_rules", "rules"]) {
    const value = config[key];
    if (Array.isArray(value)) {
      return value.map((item, index) => {
        const record = asRecord(item) || {};
        return {
          description: String(record.description || ""),
          includeCategoryIds: asStringList(record.includeCategoryIds),
          label: String(
            record.label || record.rollupId || `Rollup ${index + 1}`
          ),
          operation: record.operation === "sum_abs" ? "sum_abs" : "sum",
          rollupId: String(record.rollupId || `rollup_${index + 1}`),
        };
      });
    }
  }
  return [];
}

function getRollupCascadeRules(rules: RollupRule[]) {
  return rules.map((rule) => ({
    description: rule.description || "",
    includeCategoryIds: rule.includeCategoryIds,
    label: rule.label,
    nodeId: rule.rollupId,
    nodeType: "group",
    operation: rule.operation,
  }));
}

function getCalculationRules(
  config: Record<string, unknown>
): CalculationRule[] {
  for (const key of ["calculationRules", "calculation_rules", "rules"]) {
    const value = config[key];
    if (Array.isArray(value)) {
      return value.map((item, index) => {
        const record = asRecord(item) || {};
        const operation = CALCULATION_OPERATIONS.includes(
          record.operation as CalculationRule["operation"]
        )
          ? (record.operation as CalculationRule["operation"])
          : "add";
        return {
          calculationId: String(
            record.calculationId || record.resultKey || `calc_${index + 1}`
          ),
          description: String(record.description || ""),
          formulaExpression: String(
            record.formulaExpression || record.expression || ""
          ),
          label: String(
            record.label || record.resultKey || `Calculation ${index + 1}`
          ),
          operands: Array.isArray(record.operands)
            ? record.operands.map((operand) =>
                typeof operand === "number" ? operand : String(operand)
              )
            : asStringList(record.operands).map(parseOperand),
          operation,
          resultKey: String(
            record.resultKey || record.calculationId || `CALC_${index + 1}`
          ),
        };
      });
    }
  }
  return [];
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This editor coordinates selected rollup state, draft creation, and category editing in one focused rulebook surface.
export function RollupRulesSourceEditor({
  config,
  disabled,
  onConfigPatch,
  onSelectedRulebookItemChange,
  selectedRulebookItemId,
  showRulebookOverview = true,
  sourceLocked,
}: SplitRuleEditorProps) {
  const rules = getRollupRules(config);
  const editDisabled = disabled || sourceLocked;
  const cascadeRules = useMemo(() => getRollupCascadeRules(rules), [rules]);
  const creatingNew = selectedRulebookItemId === NEW_ROLLUP_RULE_ID;
  const [draftRule, setDraftRule] = useState<RollupRule>(() =>
    getDefaultRollupRule(rules.length)
  );
  const selectedCategoryId = getSelectedRollupCategoryId(
    creatingNew ? undefined : selectedRulebookItemId
  );
  const selectedCategoryParent = selectedCategoryId
    ? rules.find((rule) => rule.includeCategoryIds.includes(selectedCategoryId))
    : undefined;
  const [localSelectedRollupId, setLocalSelectedRollupId] = useState(() =>
    String(rules[0]?.rollupId || "")
  );
  const selectedRollupId = creatingNew
    ? ""
    : selectedCategoryParent?.rollupId ||
      (selectedRulebookItemId?.startsWith(ROLLUP_CATEGORY_SELECTION_PREFIX)
        ? ""
        : selectedRulebookItemId) ||
      localSelectedRollupId;
  const selectedRuleIndex = rules.findIndex(
    (rule) => rule.rollupId === selectedRollupId
  );
  const persistedRule =
    selectedRuleIndex >= 0 ? rules[selectedRuleIndex] : null;
  const selectedRule = creatingNew ? draftRule : persistedRule;
  const selectedCategoryIndex =
    selectedRule?.includeCategoryIds.indexOf(selectedCategoryId) ?? -1;
  const visibleSelectedCategory =
    selectedRule && selectedCategoryIndex >= 0 ? selectedCategoryId : "";

  useEffect(() => {
    if (selectedRulebookItemId === NEW_ROLLUP_RULE_ID) {
      setDraftRule(getDefaultRollupRule(rules.length));
      return;
    }
    if (!(rules.length > 0 && persistedRule)) {
      return;
    }
    setLocalSelectedRollupId(persistedRule.rollupId);
  }, [persistedRule, rules.length, selectedRulebookItemId]);

  const patchRules = (nextRules: RollupRule[]) => {
    onConfigPatch({
      outputs: "rollup_rules, rule_metadata, rule_version",
      rollupRules: nextRules,
      sourceKind: "rollup_rules",
      toolId: "source.rollup_rules",
    });
  };

  const updateRule = (index: number, patch: Partial<RollupRule>) => {
    patchRules(
      rules.map((rule, ruleIndex) =>
        ruleIndex === index ? { ...rule, ...patch } : rule
      )
    );
  };
  const selectRollup = (rollupId: string) => {
    setLocalSelectedRollupId(rollupId);
    onSelectedRulebookItemChange?.(rollupId);
  };
  const selectCategory = (categoryId: string) => {
    const parent = rules.find((rule) =>
      rule.includeCategoryIds.includes(categoryId)
    );
    if (parent) {
      setLocalSelectedRollupId(parent.rollupId);
    }
    onSelectedRulebookItemChange?.(getRollupCategorySelectionId(categoryId));
  };
  const updateSelectedRule = (patch: Partial<RollupRule>) => {
    if (!selectedRule) {
      return;
    }
    if (creatingNew) {
      setDraftRule((current) => ({ ...current, ...patch }));
      return;
    }
    if (selectedRuleIndex >= 0) {
      updateRule(selectedRuleIndex, patch);
    }
  };
  const saveDraftRule = () => {
    const nextRule = {
      ...draftRule,
      rollupId: draftRule.rollupId.trim(),
    };
    if (!nextRule.rollupId) {
      return;
    }
    patchRules([...rules, nextRule]);
    selectRollup(nextRule.rollupId);
  };
  const updateSelectedCategory = (nextCategoryId: string) => {
    if (!(selectedRule && selectedCategoryIndex >= 0)) {
      return;
    }
    const nextCategories = [...selectedRule.includeCategoryIds];
    nextCategories[selectedCategoryIndex] = nextCategoryId;
    updateSelectedRule({
      includeCategoryIds: uniqueStrings(nextCategories),
    });
    onSelectedRulebookItemChange?.(
      getRollupCategorySelectionId(nextCategoryId)
    );
  };
  const removeCategoryAt = (categoryIndex: number) => {
    if (!selectedRule) {
      return;
    }
    updateSelectedRule({
      includeCategoryIds: selectedRule.includeCategoryIds.filter(
        (_, index) => index !== categoryIndex
      ),
    });
    onSelectedRulebookItemChange?.(selectedRule.rollupId);
  };
  const [customCategoryId, setCustomCategoryId] = useState("");
  const addCustomCategory = () => {
    const categoryId = customCategoryId.trim();
    if (!(selectedRule && categoryId)) {
      return;
    }
    updateSelectedRule({
      includeCategoryIds: uniqueStrings([
        ...selectedRule.includeCategoryIds,
        categoryId,
      ]),
    });
    setCustomCategoryId("");
    if (!creatingNew) {
      onSelectedRulebookItemChange?.(getRollupCategorySelectionId(categoryId));
    }
  };

  return (
    <div className="space-y-4">
      {showRulebookOverview && (
        <AggregationRulesOverview
          emptyMessage="No rollup rules are defined yet."
          modeBadges={[{ label: "Rollups", mode: "rollup" }]}
          onSelectCategory={selectCategory}
          onSelectRule={selectRollup}
          rules={cascadeRules}
          selectedCategoryId={visibleSelectedCategory}
          selectedNodeId={selectedRule?.rollupId}
          summaryDescription="Rollup rules group mapped categories into named totals. They do not evaluate final formula calculations."
          summaryTitle="Rollup cascade"
          supportedOperationsText="Supported rollup operations: sum, sum_abs."
        />
      )}
      {selectedRule ? (
        <div className="space-y-4 rounded-md bg-muted/10 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-medium text-sm">
                {creatingNew ? "Create rollup" : "Edit selected rollup"}
              </div>
              <p className="text-muted-foreground text-xs">
                Add categories into this rollup and choose how their values are
                summed.
              </p>
            </div>
            {creatingNew ? (
              <Button
                disabled={editDisabled || !draftRule.rollupId.trim()}
                onClick={saveDraftRule}
                size="sm"
                type="button"
                variant="secondary"
              >
                Save rollup
              </Button>
            ) : (
              <Button
                disabled={editDisabled}
                onClick={() => {
                  const nextRules = rules.filter(
                    (_, ruleIndex) => ruleIndex !== selectedRuleIndex
                  );
                  patchRules(nextRules);
                  onSelectedRulebookItemChange?.(
                    String(
                      nextRules[selectedRuleIndex]?.rollupId ||
                        nextRules[0]?.rollupId ||
                        ""
                    )
                  );
                }}
                size="sm"
                type="button"
                variant="ghost"
              >
                <Trash2 className="mr-2 size-3.5" />
                Delete rollup
              </Button>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_1fr_9rem]">
            <Field label="Rollup ID">
              <Input
                disabled={editDisabled}
                onChange={(event) => {
                  updateSelectedRule({ rollupId: event.target.value });
                  if (!creatingNew) {
                    setLocalSelectedRollupId(event.target.value);
                    onSelectedRulebookItemChange?.(event.target.value);
                  }
                }}
                value={selectedRule.rollupId}
              />
            </Field>
            <Field label="Label">
              <Input
                disabled={editDisabled}
                onChange={(event) =>
                  updateSelectedRule({ label: event.target.value })
                }
                value={selectedRule.label}
              />
            </Field>
            <Field label="Operation">
              <Select
                disabled={editDisabled}
                onValueChange={(operation: RollupRule["operation"]) =>
                  updateSelectedRule({ operation })
                }
                value={selectedRule.operation}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sum">sum</SelectItem>
                  <SelectItem value="sum_abs">sum_abs</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Description">
            <Input
              disabled={editDisabled}
              onChange={(event) =>
                updateSelectedRule({ description: event.target.value })
              }
              value={selectedRule.description || ""}
            />
          </Field>

          <div className="space-y-3 rounded-md bg-background/50 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-sm">Included categories</div>
                <p className="text-muted-foreground text-xs">
                  These category IDs are summed into this rollup.
                </p>
              </div>
              <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] uppercase">
                {selectedRule.includeCategoryIds.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedRule.includeCategoryIds.length === 0 ? (
                <span className="text-muted-foreground text-xs">
                  No categories included yet.
                </span>
              ) : (
                uniqueStrings(selectedRule.includeCategoryIds).map(
                  (categoryId) => (
                    <Button
                      disabled={editDisabled || creatingNew}
                      key={categoryId}
                      onClick={() => {
                        if (!creatingNew) {
                          selectCategory(categoryId);
                        }
                      }}
                      size="sm"
                      type="button"
                      variant={
                        visibleSelectedCategory === categoryId
                          ? "default"
                          : "outline"
                      }
                    >
                      {humanizeId(categoryId)}
                    </Button>
                  )
                )
              )}
            </div>

            {visibleSelectedCategory && selectedCategoryIndex >= 0 && (
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <Field label="Selected category ID">
                  <Input
                    disabled={editDisabled}
                    onChange={(event) =>
                      updateSelectedCategory(event.target.value)
                    }
                    value={visibleSelectedCategory}
                  />
                </Field>
                <Button
                  className="self-end"
                  disabled={editDisabled}
                  onClick={() => removeCategoryAt(selectedCategoryIndex)}
                  type="button"
                  variant="outline"
                >
                  Remove category
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                disabled={editDisabled}
                onChange={(event) => setCustomCategoryId(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addCustomCategory();
                  }
                }}
                placeholder="category_id"
                value={customCategoryId}
              />
              <Button
                disabled={editDisabled || !customCategoryId.trim()}
                onClick={addCustomCategory}
                type="button"
                variant="outline"
              >
                Add category
              </Button>
            </div>
          </div>

          <details className="rounded-md bg-background/40 p-3">
            <summary className="cursor-pointer font-medium text-sm">
              Raw included category IDs
            </summary>
            <textarea
              className="mt-3 min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm"
              disabled={editDisabled}
              onChange={(event) =>
                updateSelectedRule({
                  includeCategoryIds: asStringList(event.target.value),
                })
              }
              value={selectedRule.includeCategoryIds.join(", ")}
            />
          </details>
        </div>
      ) : (
        <div className="rounded-md bg-muted/10 p-3 text-muted-foreground text-xs">
          Select a rollup from the left pane or create a new one.
        </div>
      )}
    </div>
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This editor coordinates selected calculation state, draft creation, and operand editing in one focused rulebook surface.
export function CalculationRulesSourceEditor({
  config,
  disabled,
  onConfigPatch,
  onSelectedRulebookItemChange,
  selectedRulebookItemId,
  sourceLocked,
}: SplitRuleEditorProps) {
  const rules = getCalculationRules(config);
  const editDisabled = disabled || sourceLocked;
  const [localSelectedCalculationId, setLocalSelectedCalculationId] = useState(
    () => getCalculationRuleId(rules[0] || getDefaultCalculationRule(0))
  );
  const [draftRule, setDraftRule] = useState<CalculationRule>(() =>
    getDefaultCalculationRule(rules.length)
  );
  const [operandDraft, setOperandDraft] = useState("");
  const [customTermDraft, setCustomTermDraft] = useState("");
  const [numberDraft, setNumberDraft] = useState("");
  const creatingNew = selectedRulebookItemId === NEW_CALCULATION_RULE_ID;
  const selectedCalculationId =
    (creatingNew ? "" : selectedRulebookItemId) || localSelectedCalculationId;
  const selectedRuleIndex = rules.findIndex(
    (rule) => getCalculationRuleId(rule) === selectedCalculationId
  );
  const persistedRule =
    selectedRuleIndex >= 0 ? rules[selectedRuleIndex] : null;
  const selectedRule = creatingNew ? draftRule : persistedRule;
  const operandOptions = useMemo(
    () =>
      getCalculationOperandOptions(
        rules,
        selectedRule ? getCalculationRuleId(selectedRule) : undefined
      ),
    [rules, selectedRule]
  );

  useEffect(() => {
    if (selectedRulebookItemId === NEW_CALCULATION_RULE_ID) {
      setDraftRule(getDefaultCalculationRule(rules.length));
      return;
    }
    if (persistedRule) {
      setLocalSelectedCalculationId(getCalculationRuleId(persistedRule));
    }
  }, [persistedRule, rules.length, selectedRulebookItemId]);

  const patchRules = (nextRules: CalculationRule[]) => {
    onConfigPatch({
      calculationRules: nextRules,
      outputs: "calculation_rules, rule_metadata, rule_version",
      sourceKind: "calculation_rules",
      toolId: "source.calculation_rules",
    });
  };

  const updateRule = (index: number, patch: Partial<CalculationRule>) => {
    patchRules(
      rules.map((rule, ruleIndex) =>
        ruleIndex === index ? { ...rule, ...patch } : rule
      )
    );
  };
  const selectCalculation = (calculationId: string) => {
    setLocalSelectedCalculationId(calculationId);
    onSelectedRulebookItemChange?.(calculationId);
  };
  const updateSelectedRule = (patch: Partial<CalculationRule>) => {
    if (creatingNew) {
      setDraftRule((current) => ({ ...current, ...patch }));
      return;
    }
    if (selectedRuleIndex >= 0) {
      updateRule(selectedRuleIndex, patch);
    }
  };
  const saveDraftRule = () => {
    const nextRule = {
      ...draftRule,
      calculationId: draftRule.calculationId.trim(),
      resultKey: draftRule.resultKey.trim(),
    };
    if (!(nextRule.calculationId && nextRule.resultKey)) {
      return;
    }
    patchRules([...rules, nextRule]);
    selectCalculation(getCalculationRuleId(nextRule));
  };
  const deleteSelectedRule = () => {
    if (selectedRuleIndex < 0) {
      return;
    }
    const nextRules = rules.filter(
      (_, ruleIndex) => ruleIndex !== selectedRuleIndex
    );
    patchRules(nextRules);
    selectCalculation(
      getCalculationRuleId(
        nextRules[selectedRuleIndex] ||
          nextRules[0] ||
          getDefaultCalculationRule(0)
      )
    );
  };
  const addOperand = (value = operandDraft) => {
    const operandText = value.trim();
    if (!operandText) {
      return;
    }
    updateSelectedRule({
      operands: [...(selectedRule?.operands || []), parseOperand(operandText)],
    });
    setOperandDraft("");
  };
  const removeOperandAt = (index: number) => {
    if (!selectedRule) {
      return;
    }
    updateSelectedRule({
      operands: selectedRule.operands.filter(
        (_, operandIndex) => operandIndex !== index
      ),
    });
  };
  const updateOperandAt = (index: number, value: string) => {
    if (!selectedRule) {
      return;
    }
    updateSelectedRule({
      operands: selectedRule.operands.map((operand, operandIndex) =>
        operandIndex === index ? parseOperand(value) : operand
      ),
    });
  };
  const updateFormulaExpression = (nextFormulaExpression: string) => {
    updateSelectedRule({
      formulaExpression: nextFormulaExpression,
      operation: getExpressionOperationHint(nextFormulaExpression),
    });
  };
  const addFormulaToken = (token: string) => {
    updateFormulaExpression(appendFormulaToken(formulaExpression, token));
  };
  const addCustomTerm = () => {
    const term = customTermDraft.trim();
    if (!term) {
      return;
    }
    addFormulaToken(term);
    setCustomTermDraft("");
  };
  const addNumberTerm = () => {
    const term = numberDraft.trim();
    if (!term) {
      return;
    }
    addFormulaToken(term);
    setNumberDraft("");
  };
  const formulaExpression = selectedRule
    ? getOperationFormulaExpression(selectedRule)
    : "";

  return (
    <div className="space-y-4">
      {selectedRule ? (
        <div className="space-y-4 rounded-md bg-muted/10 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-medium text-sm">
                {creatingNew
                  ? "Create result term"
                  : "Edit selected result term"}
              </div>
              <p className="text-muted-foreground text-xs">
                Build the formula by clicking terms, operators, numbers, and
                functions.
              </p>
            </div>
            <div className="flex gap-2">
              {creatingNew ? (
                <Button
                  disabled={
                    editDisabled ||
                    !(
                      draftRule.calculationId.trim() &&
                      draftRule.resultKey.trim()
                    )
                  }
                  onClick={saveDraftRule}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Save calculation
                </Button>
              ) : (
                <Button
                  disabled={editDisabled}
                  onClick={deleteSelectedRule}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="mr-2 size-3.5" />
                  Delete
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Calculation ID">
              <Input
                disabled={editDisabled}
                onChange={(event) => {
                  updateSelectedRule({ calculationId: event.target.value });
                  if (!creatingNew) {
                    selectCalculation(event.target.value);
                  }
                }}
                value={selectedRule.calculationId}
              />
            </Field>
            <Field label="Label">
              <Input
                disabled={editDisabled}
                onChange={(event) =>
                  updateSelectedRule({ label: event.target.value })
                }
                value={selectedRule.label}
              />
            </Field>
            <Field label="Result Key">
              <Input
                disabled={editDisabled}
                onChange={(event) =>
                  updateSelectedRule({ resultKey: event.target.value })
                }
                value={selectedRule.resultKey}
              />
            </Field>
          </div>

          <Field label="Description">
            <Input
              disabled={editDisabled}
              onChange={(event) =>
                updateSelectedRule({ description: event.target.value })
              }
              value={selectedRule.description || ""}
            />
          </Field>

          <div className="space-y-4 rounded-md bg-background/50 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-sm">Formula</div>
                <p className="text-muted-foreground text-xs">
                  Click terms and operations to compose this result.
                </p>
              </div>
              <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] uppercase">
                {getFormulaReferences(formulaExpression).length} terms
              </span>
            </div>

            <div className="rounded-md border bg-background p-3">
              <div className="text-muted-foreground text-xs">Result</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-sm">
                <span className="rounded bg-muted px-2 py-1">
                  {selectedRule.resultKey || "RESULT"}
                </span>
                <span>=</span>
                <span className="min-h-7 flex-1 rounded bg-muted/40 px-2 py-1">
                  {formulaExpression || "Choose terms and operators below"}
                </span>
              </div>
            </div>

            <Field label="Formula expression">
              <textarea
                className="min-h-20 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={editDisabled}
                onChange={(event) =>
                  updateFormulaExpression(event.target.value)
                }
                placeholder="income_bucket + capGains - expense_bucket * 2"
                value={formulaExpression}
              />
            </Field>

            <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs">Operations</div>
                <div className="flex flex-wrap gap-2">
                  {["+", "-", "*", "/", "(", ")", ","].map((operator) => (
                    <Button
                      className="min-w-10 font-mono"
                      disabled={editDisabled}
                      key={operator}
                      onClick={() => addFormulaToken(operator)}
                      type="button"
                      variant="outline"
                    >
                      {operator}
                    </Button>
                  ))}
                  {["min(", "max(", "round(", "abs("].map((template) => (
                    <Button
                      disabled={editDisabled}
                      key={template}
                      onClick={() => addFormulaToken(template)}
                      type="button"
                      variant="secondary"
                    >
                      {template}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground text-xs">
                  Number or custom term
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <Input
                    disabled={editDisabled}
                    onChange={(event) => setNumberDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addNumberTerm();
                      }
                    }}
                    placeholder="34400"
                    type="number"
                    value={numberDraft}
                  />
                  <Button
                    disabled={editDisabled || !numberDraft.trim()}
                    onClick={addNumberTerm}
                    type="button"
                    variant="outline"
                  >
                    Add number
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <Input
                    disabled={editDisabled}
                    onChange={(event) => setCustomTermDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCustomTerm();
                      }
                    }}
                    placeholder="category_or_rollup_id"
                    value={customTermDraft}
                  />
                  <Button
                    disabled={editDisabled || !customTermDraft.trim()}
                    onClick={addCustomTerm}
                    type="button"
                    variant="outline"
                  >
                    Add term
                  </Button>
                </div>
              </div>
            </div>

            {operandOptions.length > 0 && (
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs">Terms</div>
                <div className="flex flex-wrap gap-2">
                  {operandOptions.slice(0, 24).map((option) => (
                    <Button
                      disabled={editDisabled}
                      key={option}
                      onClick={() => addFormulaToken(option)}
                      size="sm"
                      type="button"
                      variant="secondary"
                    >
                      <Plus className="mr-1 size-3" />
                      {humanizeId(option)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                disabled={editDisabled || !formulaExpression}
                onClick={() =>
                  updateFormulaExpression(
                    removeLastFormulaToken(formulaExpression)
                  )
                }
                type="button"
                variant="outline"
              >
                Backspace
              </Button>
              <Button
                disabled={editDisabled || !formulaExpression}
                onClick={() => updateFormulaExpression("")}
                type="button"
                variant="outline"
              >
                Clear formula
              </Button>
            </div>
          </div>

          <details className="rounded-md bg-background/40 p-3">
            <summary className="cursor-pointer font-medium text-sm">
              Advanced operation fallback
            </summary>
            <div className="mt-3 space-y-3">
              <Field label="Operation">
                <Select
                  disabled={editDisabled}
                  onValueChange={(operation: CalculationRule["operation"]) =>
                    updateSelectedRule({ operation })
                  }
                  value={selectedRule.operation}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CALCULATION_OPERATIONS.map((operation) => (
                      <SelectItem key={operation} value={operation}>
                        {operation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="space-y-2">
                {selectedRule.operands.map((operand, index) => (
                  <div
                    className="grid gap-2 sm:grid-cols-[1fr_auto]"
                    key={`${formatOperand(operand)}-${index}`}
                  >
                    <Input
                      disabled={editDisabled}
                      onChange={(event) =>
                        updateOperandAt(index, event.target.value)
                      }
                      value={formatOperand(operand)}
                    />
                    <Button
                      disabled={editDisabled}
                      onClick={() => removeOperandAt(index)}
                      type="button"
                      variant="outline"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    disabled={editDisabled}
                    onChange={(event) => setOperandDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addOperand();
                      }
                    }}
                    placeholder="Raw operand"
                    value={operandDraft}
                  />
                  <Button
                    disabled={editDisabled || !operandDraft.trim()}
                    onClick={() => addOperand()}
                    type="button"
                    variant="outline"
                  >
                    Add operand
                  </Button>
                </div>
              </div>
            </div>
          </details>
        </div>
      ) : (
        <div className="rounded-md bg-muted/10 p-3 text-muted-foreground text-xs">
          Select a result term from the left pane or create a new one.
        </div>
      )}
    </div>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
