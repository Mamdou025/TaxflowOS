

import { Calculator, Copy, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";
import type { WorkflowEdge, WorkflowNode } from "@/shared/workflow-engine/state/workflow-store";
import {
  AGGREGATION_RULE_MODE_DESCRIPTIONS,
  getAggregationRuleMode,
  getAggregationRuleModeDescription,
  getAggregationRuleModeLabel,
  SUPPORTED_AGGREGATION_OPERATIONS,
} from "./aggregation-rule-modes";
import { AggregationRulesOverview } from "./aggregation-rules-overview";
import { KeywordRulebookEditor } from "./keyword-rulebook-editor";

const SIGN_PREFIX_REGEX = /^[+-]/;
export const NEW_AGGREGATION_RULE_NODE_ID = "__new_aggregation_rule_node__";
export const NEW_ROLLUP_RULE_ID = "__new_rollup_rule__";
export const NEW_CALCULATION_RULE_ID = "__new_calculation_rule__";
export const NEW_KEYWORD_RULE_ID = "__new_keyword_rule__";
const AGGREGATION_CATEGORY_SELECTION_PREFIX = "__aggregation_category__:";
const ROLLUP_CATEGORY_SELECTION_PREFIX = "__rollup_category__:";

type RuleDraft = {
  categoryId: string;
  categoryLabel: string;
  confidence: string;
  description: string;
  keywords: string;
  matchMode: string;
  priority: string;
  ruleId: string;
  suggestedLine: string;
  suggestedSection: string;
  suggestedSubsection: string;
};

type AggregationRuleDraft = {
  children: string;
  description: string;
  formulaExpression: string;
  includeCategoryIds: string;
  label: string;
  nodeId: string;
  nodeType: string;
  operation: string;
  operands: string;
  order: string;
  outputRole: string;
  resultName: string;
  value: string;
};

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
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function getKeywordRules(config: Record<string, unknown>) {
  for (const key of ["keywordRules", "rules", "manualRules"]) {
    const value = config[key];
    if (Array.isArray(value)) {
      return value
        .map(asRecord)
        .filter((rule): rule is Record<string, unknown> => Boolean(rule));
    }
  }
  return [];
}

export function getAggregationRules(config: Record<string, unknown>) {
  for (const key of [
    "aggregationRules",
    "aggregation_rules",
    "rules",
    "nodes",
  ]) {
    const value = config[key];
    if (Array.isArray(value)) {
      return value
        .map(asRecord)
        .filter((rule): rule is Record<string, unknown> => Boolean(rule));
    }
  }
  return [];
}

function getRollupRules(config: Record<string, unknown>) {
  for (const key of ["rollupRules", "rollup_rules", "rules"]) {
    const value = config[key];
    if (Array.isArray(value)) {
      return value
        .map(asRecord)
        .filter((rule): rule is Record<string, unknown> => Boolean(rule));
    }
  }
  return [];
}

function getRollupCascadeRules(rules: Record<string, unknown>[]) {
  return rules.map((rule, index) => {
    const rollupId = String(rule.rollupId || `rollup_${index + 1}`);
    return {
      description: String(rule.description || ""),
      includeCategoryIds: asStringList(rule.includeCategoryIds),
      label: String(rule.label || humanizeRuleId(rollupId)),
      nodeId: rollupId,
      nodeType: "group",
      operation: String(rule.operation || "sum"),
    };
  });
}

function getCalculationRuleId(rule: Record<string, unknown>) {
  return String(rule.calculationId || rule.resultKey || "");
}

function getCalculationRules(config: Record<string, unknown>) {
  for (const key of ["calculationRules", "calculation_rules", "rules"]) {
    const value = config[key];
    if (Array.isArray(value)) {
      return value
        .map(asRecord)
        .filter((rule): rule is Record<string, unknown> => Boolean(rule));
    }
  }
  return [];
}

function parseNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return null;
  }
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function getRuleDraft(rule?: Record<string, unknown>): RuleDraft {
  return {
    categoryId: String(
      rule?.categoryId || rule?.category || rule?.target || ""
    ),
    categoryLabel: String(rule?.categoryLabel || rule?.label || ""),
    confidence: String(rule?.confidence ?? "0.9"),
    description: String(rule?.description ?? ""),
    keywords: Array.isArray(rule?.keywords)
      ? rule.keywords.map(String).join(", ")
      : String(rule?.keywords ?? ""),
    matchMode: String(rule?.matchMode ?? "contains"),
    priority: String(rule?.priority ?? "10"),
    ruleId: String(rule?.ruleId ?? ""),
    suggestedLine: String(rule?.suggestedLine || rule?.lineId || ""),
    suggestedSection: String(rule?.suggestedSection || rule?.sectionId || ""),
    suggestedSubsection: String(
      rule?.suggestedSubsection || rule?.subsectionId || ""
    ),
  };
}

function normalizeRuleDraft(draft: RuleDraft, fallbackIndex: number) {
  const keywords = draft.keywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  if (!draft.categoryId.trim()) {
    throw new Error("Category ID is required.");
  }
  if (keywords.length === 0) {
    throw new Error("At least one keyword is required.");
  }

  return {
    confidence: parseNumber(draft.confidence) ?? 0.85,
    categoryId: draft.categoryId.trim(),
    categoryLabel: draft.categoryLabel.trim() || draft.categoryId.trim(),
    description: draft.description.trim(),
    keywords,
    matchMode: draft.matchMode || "contains",
    priority: parseNumber(draft.priority) ?? fallbackIndex + 1,
    ruleId:
      draft.ruleId.trim() ||
      `rule-${String(fallbackIndex + 1).padStart(3, "0")}`,
    suggestedLine: draft.suggestedLine.trim(),
    suggestedSection: draft.suggestedSection.trim(),
    suggestedSubsection: draft.suggestedSubsection.trim(),
  };
}

type AggregationOperandDraft = {
  label?: string;
  refId?: string;
  refType: "category" | "constant" | "node";
  sign?: 1 | -1;
  value?: number;
};

function getOptionalNumber(value: string) {
  if (!value.trim()) {
    return;
  }
  return parseNumber(value) ?? undefined;
}

function parseOperandToken(token: string): AggregationOperandDraft | null {
  const trimmed = token.trim();
  if (!trimmed) {
    return null;
  }
  const sign = trimmed.startsWith("-") ? -1 : 1;
  const tokenWithoutSign = trimmed.replace(SIGN_PREFIX_REGEX, "").trim();
  const [prefix, ...rest] = tokenWithoutSign.split(":");
  const body = rest.length > 0 ? rest.join(":").trim() : prefix.trim();
  const normalizedPrefix = rest.length > 0 ? prefix.trim().toLowerCase() : "";

  if (normalizedPrefix === "constant" || normalizedPrefix === "value") {
    return {
      refType: "constant",
      sign,
      value: parseNumber(body) ?? 0,
    };
  }
  if (normalizedPrefix === "category") {
    return { refId: body, refType: "category", sign };
  }
  return {
    refId: body,
    refType: "node",
    sign,
  };
}

function normalizeOperand(value: unknown): AggregationOperandDraft | null {
  const numberValue = parseNumber(value);
  if (numberValue !== null) {
    return { refType: "constant", value: numberValue };
  }
  if (typeof value === "string") {
    return parseOperandToken(value);
  }

  const record = asRecord(value);
  if (!record) {
    return null;
  }
  const refType =
    record.refType === "category" || record.refType === "constant"
      ? record.refType
      : "node";
  const valueNumber = parseNumber(record.value);
  const operand = {
    label: String(record.label || "") || undefined,
    refId: String(record.refId || "") || undefined,
    refType,
    sign: record.sign === -1 || record.sign === "-1" ? -1 : 1,
    value: valueNumber ?? undefined,
  } satisfies AggregationOperandDraft;

  return operand.refId || operand.value !== undefined ? operand : null;
}

function parseAggregationOperands(value: string): AggregationOperandDraft[] {
  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const parsed = JSON.parse(trimmed);
    const source = Array.isArray(parsed) ? parsed : [parsed];
    return source
      .map(normalizeOperand)
      .filter((operand): operand is AggregationOperandDraft =>
        Boolean(operand)
      );
  }

  return trimmed
    .split(",")
    .map(parseOperandToken)
    .filter((operand): operand is AggregationOperandDraft => Boolean(operand));
}

function formatOperand(operand: unknown) {
  const normalized = normalizeOperand(operand);
  if (!normalized) {
    return "";
  }
  const signPrefix = normalized.sign === -1 ? "-" : "";
  if (normalized.refType === "constant") {
    return `${signPrefix}constant:${normalized.value ?? 0}`;
  }
  return `${signPrefix}${normalized.refType}:${normalized.refId || ""}`;
}

function isCategoryOperand(
  operand: AggregationOperandDraft | null
): operand is AggregationOperandDraft {
  return operand?.refType === "category";
}

function splitCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinCommaList(values: string[]) {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");
}

function removeCommaListValueAt(value: string, index: number) {
  return joinCommaList(
    splitCommaList(value).filter((_, itemIndex) => itemIndex !== index)
  );
}

function uniqueStrings(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean))
  );
}

function humanizeRuleId(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getSelectedAggregationCategoryId(selection?: string) {
  return selection?.startsWith(AGGREGATION_CATEGORY_SELECTION_PREFIX)
    ? selection.slice(AGGREGATION_CATEGORY_SELECTION_PREFIX.length)
    : "";
}

function getAggregationCategorySelectionId(categoryId: string) {
  return `${AGGREGATION_CATEGORY_SELECTION_PREFIX}${categoryId}`;
}

function getSelectedRollupCategoryId(selection?: string) {
  return selection?.startsWith(ROLLUP_CATEGORY_SELECTION_PREFIX)
    ? selection.slice(ROLLUP_CATEGORY_SELECTION_PREFIX.length)
    : "";
}

function getRollupCategorySelectionId(categoryId: string) {
  return `${ROLLUP_CATEGORY_SELECTION_PREFIX}${categoryId}`;
}

function getRuleCategoryIds(rule: Record<string, unknown>) {
  const includeCategoryIds = asStringList(rule.includeCategoryIds);
  const operandCategoryIds = Array.isArray(rule.operands)
    ? rule.operands
        .map(normalizeOperand)
        .filter(isCategoryOperand)
        .map((operand) => operand.refId || "")
    : splitCommaList(String(rule.operands || ""))
        .map(parseOperandToken)
        .filter(isCategoryOperand)
        .map((operand) => operand.refId || "");

  return [...includeCategoryIds, ...operandCategoryIds];
}

function getAggregationCategoryOptions(
  rules: Record<string, unknown>[],
  draft: AggregationRuleDraft
) {
  let draftOperandCategoryIds: string[] = [];
  try {
    draftOperandCategoryIds = parseAggregationOperands(draft.operands)
      .filter((operand) => operand.refType === "category")
      .map((operand) => operand.refId || "");
  } catch {
    draftOperandCategoryIds = [];
  }

  return uniqueStrings([
    ...rules.flatMap(getRuleCategoryIds),
    ...splitCommaList(draft.includeCategoryIds),
    ...draftOperandCategoryIds,
  ]);
}

function getAggregationNodeOptions(
  rules: Record<string, unknown>[],
  draft: AggregationRuleDraft
) {
  const currentNodeIds = new Set(
    [draft.nodeId, draft.nodeId.trim()].filter(Boolean)
  );

  return rules
    .filter((rule) => !currentNodeIds.has(String(rule.nodeId || "")))
    .map((rule) => ({
      id: String(rule.nodeId || ""),
      label: String(rule.label || rule.nodeId || ""),
    }))
    .filter((option) => option.id);
}

function describeOperandToken(token: string) {
  const operand = parseOperandToken(token);
  if (!operand) {
    return token;
  }
  const signPrefix = operand.sign === -1 ? "-" : "";
  if (operand.refType === "constant") {
    return `${signPrefix}${operand.value ?? 0}`;
  }
  return `${signPrefix}${humanizeRuleId(operand.refId || "")}`;
}

function getDraftFormulaPreview(draft: AggregationRuleDraft) {
  if (draft.formulaExpression.trim()) {
    return `${draft.label || draft.nodeId || "Node"} = ${draft.formulaExpression.trim()}`;
  }

  const operandTokens = splitCommaList(draft.operands);
  const categoryTokens = splitCommaList(draft.includeCategoryIds).map(
    (categoryId) => `category:${categoryId}`
  );
  const childTokens = splitCommaList(draft.children).map(
    (childId) => `node:${childId}`
  );
  const tokens =
    operandTokens.length > 0
      ? operandTokens
      : [...categoryTokens, ...childTokens];

  if (tokens.length === 0 && draft.value.trim()) {
    return `${draft.label || draft.nodeId || "Node"} = ${draft.value.trim()}`;
  }
  if (tokens.length === 0) {
    return "Pick categories, existing nodes, or numbers to build this formula.";
  }

  const symbolByOperation: Record<string, string> = {
    add: "+",
    divide: "/",
    multiply: "*",
    pass_through: "->",
    subtract: "-",
    sum: "+",
  };
  const symbol = symbolByOperation[draft.operation] || "+";
  const expression =
    draft.operation === "pass_through"
      ? describeOperandToken(tokens[0])
      : tokens.map(describeOperandToken).join(` ${symbol} `);

  return `${draft.label || draft.nodeId || "Node"} = ${expression}`;
}

export function RulesTable({
  compact,
  fill,
  rules,
  selectedRuleId,
  onSelectRule,
}: {
  rules: Record<string, unknown>[];
  compact?: boolean;
  fill?: boolean;
  selectedRuleId?: string;
  onSelectRule?: (ruleId: string) => void;
}) {
  return (
    <div
      className={cn(
        "overflow-auto rounded-md border bg-background/70",
        fill ? "min-h-0 flex-1" : "max-h-72"
      )}
    >
      <table className="w-full min-w-[920px] text-left text-xs">
        <thead className="sticky top-0 bg-background">
          <tr className="border-b">
            {[
              "Rule ID",
              "Category ID",
              "Category Label",
              "Keywords",
              "Match mode",
              "Confidence",
              "Priority",
              "Description",
              "Optional Hints",
            ].map((header) => (
              <th className="px-2 py-1 font-medium" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rules.length === 0 ? (
            <tr>
              <td className="px-2 py-3 text-muted-foreground" colSpan={9}>
                No draft rules yet.
              </td>
            </tr>
          ) : (
            rules.map((rule) => (
              <RuleTableRow
                compact={compact}
                key={String(rule.ruleId || "")}
                onSelectRule={onSelectRule}
                rule={rule}
                selected={selectedRuleId === String(rule.ruleId || "")}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function RuleTableRow({
  compact,
  onSelectRule,
  rule,
  selected,
}: {
  rule: Record<string, unknown>;
  compact?: boolean;
  onSelectRule?: (ruleId: string) => void;
  selected: boolean;
}) {
  const ruleId = String(rule.ruleId || "");
  const keywords = Array.isArray(rule.keywords)
    ? rule.keywords.join(", ")
    : String(rule.keywords || "");
  const hints = [
    rule.suggestedLine || rule.lineId,
    rule.suggestedSection || rule.sectionId,
    rule.suggestedSubsection || rule.subsectionId,
  ]
    .map(String)
    .filter(Boolean)
    .join(" / ");

  return (
    <tr
      className={`cursor-pointer border-b last:border-b-0 ${
        selected ? "bg-primary/10" : ""
      }`}
      onClick={() => onSelectRule?.(ruleId)}
    >
      <td className="px-2 py-1">{ruleId}</td>
      <td className="px-2 py-1">
        {String(rule.categoryId || rule.target || "")}
      </td>
      <td className="px-2 py-1">{String(rule.categoryLabel || "")}</td>
      <td className="max-w-64 truncate px-2 py-1">{keywords}</td>
      <td className="px-2 py-1">{String(rule.matchMode || "")}</td>
      <td className="px-2 py-1">{String(rule.confidence ?? "")}</td>
      <td className="px-2 py-1">{String(rule.priority ?? "")}</td>
      <td className={`truncate px-2 py-1 ${compact ? "max-w-40" : "max-w-64"}`}>
        {String(rule.description || "")}
      </td>
      <td className="max-w-40 truncate px-2 py-1">{hints}</td>
    </tr>
  );
}

function LockedRulesCallout({
  onCreateSourceVersion,
  sourceUsedInRun,
  sourceVersion,
}: {
  onCreateSourceVersion: () => void;
  sourceUsedInRun: boolean;
  sourceVersion: number;
}) {
  return (
    <div className="space-y-2 rounded-md border bg-muted/40 p-3 text-xs">
      <div className="font-medium">Rulebook is locked</div>
      <p className="text-muted-foreground">
        {sourceUsedInRun
          ? "This rulebook has run history. Create a new version before changing rule definitions."
          : "Published rulebooks should be changed through a new draft version."}
      </p>
      <Button onClick={onCreateSourceVersion} size="sm" type="button">
        Create new rulebook version from v{sourceVersion}
      </Button>
    </div>
  );
}

export function RuleSourceEditor({
  config,
  disabled,
  onConfigPatch,
  onCreateSourceVersion,
  onSelectedRulebookItemChange,
  selectedRulebookItemId,
  showRulebookOverview = true,
  sourceLocked,
  sourceUsedInRun,
  sourceVersion,
}: {
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
}) {
  const rules = useMemo(() => getKeywordRules(config), [config]);
  const [importText, setImportText] = useState(() =>
    JSON.stringify(rules, null, 2)
  );

  useEffect(() => {
    setImportText(JSON.stringify(rules, null, 2));
  }, [rules]);

  const patchRules = (nextRules: Record<string, unknown>[]) => {
    onConfigPatch({
      keywordRules: nextRules,
      ruleVersion: config.ruleVersion || `v${sourceVersion}`,
      sourceKind: "keyword_rules",
      sourceStatus: "draft",
      toolId: "source.keyword_rules",
    });
  };

  const importRules = () => {
    try {
      const parsed = JSON.parse(importText);
      const source = Array.isArray(parsed)
        ? parsed
        : asRecord(parsed)?.keywordRules || asRecord(parsed)?.rules;
      if (!Array.isArray(source)) {
        throw new Error(
          "Rulebook JSON must be an array or contain keywordRules."
        );
      }
      const nextRules = source.map((rule, index) =>
        normalizeRuleDraft(getRuleDraft(asRecord(rule) || undefined), index)
      );
      patchRules(nextRules);
      toast.success(`${nextRules.length} rule(s) imported`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Rulebook JSON did not parse"
      );
    }
  };

  const copyRules = async () => {
    await navigator.clipboard.writeText(JSON.stringify(rules, null, 2));
    toast.success("Rulebook JSON copied");
  };

  return (
    <div className="space-y-4">
      {sourceLocked && (
        <LockedRulesCallout
          onCreateSourceVersion={onCreateSourceVersion}
          sourceUsedInRun={sourceUsedInRun}
          sourceVersion={sourceVersion}
        />
      )}

      <KeywordRulebookEditor
        disabled={disabled || sourceLocked}
        onRulesChange={patchRules}
        onSelectedRuleIdChange={onSelectedRulebookItemChange}
        rules={rules}
        selectedRuleId={selectedRulebookItemId}
        showCategoryList={showRulebookOverview}
        sourceVersion={sourceVersion}
      />

      <div className="space-y-2 rounded-md border bg-muted/20 p-3">
        <Label className="ml-1">Advanced JSON import / export</Label>
        <textarea
          className="min-h-28 w-full rounded-md border bg-background px-3 py-2 font-mono text-xs outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || sourceLocked}
          onChange={(event) => setImportText(event.target.value)}
          spellCheck={false}
          value={importText}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={disabled || sourceLocked}
            onClick={importRules}
            size="sm"
            type="button"
            variant="secondary"
          >
            Import rulebook JSON
          </Button>
          <Button
            disabled={disabled}
            onClick={copyRules}
            size="sm"
            type="button"
            variant="outline"
          >
            <Copy className="mr-2 size-3.5" />
            Export rulebook JSON
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatDraftListField(value: unknown) {
  return Array.isArray(value)
    ? value.map(String).join(", ")
    : String(value ?? "");
}

function formatDraftOperandsField(value: unknown) {
  return Array.isArray(value)
    ? value.map(formatOperand).filter(Boolean).join(", ")
    : String(value ?? "");
}

function getAggregationRuleDraft(
  rule?: Record<string, unknown>
): AggregationRuleDraft {
  return {
    children: formatDraftListField(rule?.children),
    description: String(rule?.description ?? ""),
    formulaExpression: String(
      rule?.formulaExpression || rule?.expression || ""
    ),
    includeCategoryIds: formatDraftListField(rule?.includeCategoryIds),
    label: String(rule?.label ?? ""),
    nodeId: String(rule?.nodeId ?? ""),
    nodeType: String(rule?.nodeType ?? "group"),
    operation: String(rule?.operation ?? "sum"),
    operands: formatDraftOperandsField(rule?.operands),
    order: String(rule?.order ?? ""),
    outputRole: String(rule?.outputRole ?? ""),
    resultName: String(rule?.resultName ?? ""),
    value: String(rule?.value ?? ""),
  };
}

function normalizeAggregationRuleDraft(
  draft: AggregationRuleDraft,
  fallbackIndex: number
) {
  if (!draft.nodeId.trim()) {
    throw new Error("Node ID is required.");
  }

  const splitList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  return {
    children: splitList(draft.children),
    description: draft.description.trim(),
    formulaExpression: draft.formulaExpression.trim(),
    includeCategoryIds: splitList(draft.includeCategoryIds),
    label:
      draft.label.trim() ||
      `Aggregation node ${String(fallbackIndex + 1).padStart(3, "0")}`,
    nodeId: draft.nodeId.trim(),
    nodeType: draft.nodeType || "group",
    operands: parseAggregationOperands(draft.operands),
    operation: draft.operation || "sum",
    order: getOptionalNumber(draft.order),
    outputRole: draft.outputRole.trim(),
    resultName: draft.resultName.trim(),
    value: getOptionalNumber(draft.value),
  };
}

export function AggregationRulesTable({
  compact,
  fill,
  onSelectRule,
  rules,
  selectedNodeId,
}: {
  rules: Record<string, unknown>[];
  compact?: boolean;
  fill?: boolean;
  selectedNodeId?: string;
  onSelectRule?: (nodeId: string) => void;
}) {
  return (
    <div
      className={cn(
        "overflow-auto rounded-md bg-background/45",
        fill ? "min-h-0 flex-1" : "max-h-72"
      )}
    >
      <table className="w-full min-w-[1180px] text-left text-xs">
        <thead className="sticky top-0 bg-background">
          <tr className="border-border/30 border-b">
            {[
              "Node ID",
              "Label",
              "Mode",
              "Type",
              "Operation",
              "Included categories",
              "Children",
              "Operands",
              "Formula",
              "Constant value",
              "Output role",
              "Result name",
              "Description",
            ].map((header) => (
              <th className="px-2 py-1 font-medium" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rules.length === 0 ? (
            <tr>
              <td className="px-2 py-3 text-muted-foreground" colSpan={13}>
                No aggregation nodes yet.
              </td>
            </tr>
          ) : (
            rules.map((rule) => (
              <AggregationRuleTableRow
                compact={compact}
                key={String(rule.nodeId || "")}
                onSelectRule={onSelectRule}
                rule={rule}
                selected={selectedNodeId === String(rule.nodeId || "")}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Table row renders several optional aggregation fields in one compact view.
function AggregationRuleTableRow({
  compact,
  onSelectRule,
  rule,
  selected,
}: {
  rule: Record<string, unknown>;
  compact?: boolean;
  onSelectRule?: (nodeId: string) => void;
  selected: boolean;
}) {
  const nodeId = String(rule.nodeId || "");

  return (
    <tr
      className={`cursor-pointer border-border/20 border-b last:border-b-0 ${
        selected ? "bg-primary/10" : ""
      }`}
      onClick={() => onSelectRule?.(nodeId)}
    >
      <td className="px-2 py-1">{nodeId}</td>
      <td className="px-2 py-1">{String(rule.label || "")}</td>
      <td className="px-2 py-1">
        <span className="rounded-full bg-muted/50 px-2 py-0.5 text-[10px] uppercase">
          {getAggregationRuleModeLabel(rule)}
        </span>
      </td>
      <td className="px-2 py-1">{String(rule.nodeType || "")}</td>
      <td className="px-2 py-1">{String(rule.operation || "")}</td>
      <td className="max-w-72 truncate px-2 py-1">
        {Array.isArray(rule.includeCategoryIds)
          ? rule.includeCategoryIds.join(", ")
          : String(rule.includeCategoryIds || "")}
      </td>
      <td className="max-w-56 truncate px-2 py-1">
        {Array.isArray(rule.children)
          ? rule.children.join(", ")
          : String(rule.children || "")}
      </td>
      <td className="max-w-64 truncate px-2 py-1">
        {Array.isArray(rule.operands)
          ? rule.operands.map(formatOperand).filter(Boolean).join(", ")
          : String(rule.operands || "")}
      </td>
      <td className="max-w-72 truncate px-2 py-1">
        {String(rule.formulaExpression || rule.expression || "")}
      </td>
      <td className="px-2 py-1">{String(rule.value ?? "")}</td>
      <td className="px-2 py-1">{String(rule.outputRole || "")}</td>
      <td className="px-2 py-1">{String(rule.resultName || "")}</td>
      <td className={`truncate px-2 py-1 ${compact ? "max-w-40" : "max-w-64"}`}>
        {String(rule.description || "")}
      </td>
    </tr>
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This editor coordinates draft node selection, version locks, and rulebook persistence until it is split into a focused component.
export function AggregationRuleSourceEditor({
  config,
  disabled,
  onConfigPatch,
  onCreateSourceVersion,
  onSelectedNodeIdChange,
  selectedNodeId: controlledSelectedNodeId,
  showRulebookOverview = true,
  sourceLocked,
  sourceUsedInRun,
  sourceVersion,
}: {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
  onCreateSourceVersion: () => void;
  onSelectedNodeIdChange?: (nodeId: string) => void;
  selectedNodeId?: string;
  showRulebookOverview?: boolean;
  sourceLocked: boolean;
  sourceUsedInRun: boolean;
  sourceVersion: number;
}) {
  const rules = useMemo(() => getAggregationRules(config), [config]);
  const [localSelectedNodeId, setLocalSelectedNodeId] = useState(() =>
    String(rules[0]?.nodeId || "")
  );
  const selectedCategoryId = getSelectedAggregationCategoryId(
    controlledSelectedNodeId
  );
  const selectedNodeId =
    selectedCategoryId || controlledSelectedNodeId || localSelectedNodeId;
  const selectedRule =
    rules.find((rule) => String(rule.nodeId) === selectedNodeId) ||
    (selectedCategoryId ? undefined : rules[0]);
  const [draft, setDraft] = useState<AggregationRuleDraft>(() =>
    getAggregationRuleDraft(selectedRule)
  );
  const [importText, setImportText] = useState(() =>
    JSON.stringify(rules, null, 2)
  );
  const [constantTerm, setConstantTerm] = useState("0");
  const [customCategoryId, setCustomCategoryId] = useState("");

  const categoryOptions = useMemo(
    () => getAggregationCategoryOptions(rules, draft),
    [rules, draft]
  );
  const nodeOptions = useMemo(
    () => getAggregationNodeOptions(rules, draft),
    [rules, draft]
  );
  const selectedCategoryIds = splitCommaList(draft.includeCategoryIds);
  const formulaPreview = getDraftFormulaPreview(draft);
  const draftModeRule = useMemo(
    () => ({
      formulaExpression: draft.formulaExpression,
      nodeType: draft.nodeType,
      outputRole: draft.outputRole,
      resultName: draft.resultName,
    }),
    [
      draft.formulaExpression,
      draft.nodeType,
      draft.outputRole,
      draft.resultName,
    ]
  );
  const draftMode = getAggregationRuleMode(draftModeRule);
  const draftModeLabel = getAggregationRuleModeLabel(draftModeRule);
  const draftModeDescription = getAggregationRuleModeDescription(draftModeRule);
  const showRollupFields = draftMode === "rollup";
  const showFormulaFields =
    draftMode === "formula" ||
    draftMode === "final_result" ||
    draftMode === "official_line";
  const showConstantFields = draftMode === "constant";
  const showResultFields =
    draftMode === "final_result" || draftMode === "official_line";

  const setSelectedRuleNodeId = useCallback(
    (nodeId: string) => {
      setLocalSelectedNodeId(nodeId);
      onSelectedNodeIdChange?.(nodeId);
    },
    [onSelectedNodeIdChange]
  );

  const newDraftRule = useMemo(
    () =>
      getAggregationRuleDraft({
        label: "New aggregation node",
        nodeId: `node-${String(rules.length + 1).padStart(3, "0")}`,
        nodeType: "group",
        operation: "sum",
      }),
    [rules.length]
  );

  useEffect(() => {
    if (controlledSelectedNodeId === NEW_AGGREGATION_RULE_NODE_ID) {
      setLocalSelectedNodeId("");
      setDraft(newDraftRule);
      return;
    }

    if (selectedCategoryId) {
      const existingCategoryRule = rules.find(
        (rule) => String(rule.nodeId) === selectedCategoryId
      );
      setLocalSelectedNodeId(selectedCategoryId);
      setDraft(
        getAggregationRuleDraft(
          existingCategoryRule || {
            description: `Editable aggregation node for ${humanizeRuleId(selectedCategoryId)}.`,
            includeCategoryIds: [selectedCategoryId],
            label: humanizeRuleId(selectedCategoryId),
            nodeId: selectedCategoryId,
            nodeType: "category_total",
            operation: "sum",
          }
        )
      );
      return;
    }

    if (
      rules.length > 0 &&
      selectedNodeId &&
      !rules.some((rule) => String(rule.nodeId) === selectedNodeId)
    ) {
      setSelectedRuleNodeId(String(rules[0]?.nodeId || ""));
    }
  }, [
    controlledSelectedNodeId,
    newDraftRule,
    rules,
    selectedCategoryId,
    selectedNodeId,
    setSelectedRuleNodeId,
  ]);

  useEffect(() => {
    if (
      controlledSelectedNodeId === NEW_AGGREGATION_RULE_NODE_ID ||
      selectedCategoryId
    ) {
      return;
    }
    setDraft(getAggregationRuleDraft(selectedRule));
  }, [controlledSelectedNodeId, selectedCategoryId, selectedRule]);

  useEffect(() => {
    setImportText(JSON.stringify(rules, null, 2));
  }, [rules]);

  const patchRules = (nextRules: Record<string, unknown>[]) => {
    onConfigPatch({
      aggregationRules: nextRules,
      ruleVersion: config.ruleVersion || `v${sourceVersion}`,
      sourceKind: "aggregation_rules",
      sourceStatus: "draft",
      toolId: "source.aggregation_rules",
    });
  };

  const upsertDraftRule = () => {
    try {
      const normalized = normalizeAggregationRuleDraft(draft, rules.length);
      const selectedExists = rules.some(
        (rule) => String(rule.nodeId) === selectedNodeId
      );
      const nodeIdConflict = rules.some(
        (rule) => String(rule.nodeId) === String(normalized.nodeId)
      );
      if (
        selectedExists &&
        selectedNodeId !== String(normalized.nodeId) &&
        nodeIdConflict
      ) {
        throw new Error("Another aggregation node already uses this Node ID.");
      }

      const nextRules = selectedExists
        ? rules.map((rule) =>
            String(rule.nodeId) === selectedNodeId ? normalized : rule
          )
        : [...rules, normalized];
      patchRules(nextRules);
      setSelectedRuleNodeId(String(normalized.nodeId));
      toast.success(
        selectedExists ? "Aggregation node updated" : "Aggregation node added"
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Node is invalid");
    }
  };

  const startNewRule = () => {
    setSelectedRuleNodeId(NEW_AGGREGATION_RULE_NODE_ID);
    setDraft(newDraftRule);
  };

  const duplicateSelectedRule = () => {
    if (!selectedRule) {
      return;
    }
    const nextRule = {
      ...selectedRule,
      nodeId: `${String(selectedRule.nodeId || "node")}-copy`,
    };
    patchRules([...rules, nextRule]);
    setSelectedRuleNodeId(String(nextRule.nodeId));
    toast.success("Aggregation node duplicated");
  };

  const deleteSelectedRule = () => {
    if (!selectedRule) {
      return;
    }
    const nextRules = rules.filter(
      (rule) => String(rule.nodeId) !== String(selectedRule.nodeId)
    );
    patchRules(nextRules);
    setSelectedRuleNodeId(String(nextRules[0]?.nodeId || ""));
    toast.success("Draft aggregation node deleted");
  };

  const importRules = () => {
    try {
      const parsed = JSON.parse(importText);
      const source = Array.isArray(parsed)
        ? parsed
        : asRecord(parsed)?.aggregationRules || asRecord(parsed)?.rules;
      if (!Array.isArray(source)) {
        throw new Error(
          "Rulebook JSON must be an array or contain aggregationRules."
        );
      }
      const nextRules = source.map((rule, index) =>
        normalizeAggregationRuleDraft(
          getAggregationRuleDraft(asRecord(rule) || undefined),
          index
        )
      );
      patchRules(nextRules);
      setSelectedRuleNodeId(String(nextRules[0]?.nodeId || ""));
      toast.success(`${nextRules.length} aggregation node(s) imported`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Rulebook JSON did not parse"
      );
    }
  };

  const copyRules = async () => {
    await navigator.clipboard.writeText(JSON.stringify(rules, null, 2));
    toast.success("Aggregation rulebook JSON copied");
  };

  const addCategoryToRollup = (categoryId: string) => {
    setDraft((current) => ({
      ...current,
      includeCategoryIds: uniqueStrings([
        ...splitCommaList(current.includeCategoryIds),
        categoryId,
      ]).join(", "),
    }));
  };

  const removeCategoryFromRollup = (index: number) => {
    setDraft((current) => ({
      ...current,
      includeCategoryIds: removeCommaListValueAt(
        current.includeCategoryIds,
        index
      ),
    }));
  };

  const appendFormulaToken = (token: string) => {
    setDraft((current) => ({
      ...current,
      formulaExpression: [current.formulaExpression.trim(), token]
        .filter(Boolean)
        .join(" "),
      nodeType: current.nodeType === "group" ? "formula" : current.nodeType,
    }));
  };

  const clearFormulaExpression = () => {
    setDraft((current) => ({ ...current, formulaExpression: "" }));
  };

  const addCustomCategory = () => {
    const categoryId = customCategoryId.trim();
    if (!categoryId) {
      return;
    }
    addCategoryToRollup(categoryId);
    setCustomCategoryId("");
  };

  const addConstantOperand = () => {
    const value = parseNumber(constantTerm);
    if (value === null) {
      toast.error("Enter a valid number.");
      return;
    }
    appendFormulaToken(String(value));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-md bg-muted/10 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-medium text-sm">Aggregation Rulebook</div>
            <p className="mt-1 text-muted-foreground text-xs">
              Edit the rollup tree that turns mapped categories into groups,
              formulas, and final outputs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase">
              {rules.length} node{rules.length === 1 ? "" : "s"}
            </span>
            {!sourceLocked && (
              <Button
                disabled={disabled}
                onClick={startNewRule}
                size="sm"
                type="button"
                variant="secondary"
              >
                <Plus className="mr-2 size-3.5" />
                New node
              </Button>
            )}
          </div>
        </div>

        {showRulebookOverview && (
          <>
            <AggregationRulesOverview
              onSelectRule={sourceLocked ? undefined : setSelectedRuleNodeId}
              rules={rules}
              selectedNodeId={selectedNodeId}
            />

            <details className="rounded-md bg-background/30 p-2">
              <summary className="cursor-pointer text-muted-foreground text-xs">
                Table view
              </summary>
              <div className="mt-2">
                <AggregationRulesTable
                  onSelectRule={setSelectedRuleNodeId}
                  rules={rules}
                  selectedNodeId={selectedNodeId}
                />
              </div>
            </details>
          </>
        )}

        {sourceLocked && (
          <LockedRulesCallout
            onCreateSourceVersion={onCreateSourceVersion}
            sourceUsedInRun={sourceUsedInRun}
            sourceVersion={sourceVersion}
          />
        )}
      </div>

      {!sourceLocked && (
        <>
          <div className="grid gap-3 rounded-md bg-muted/10 p-3 sm:grid-cols-2">
            <div className="flex items-start justify-between gap-3 sm:col-span-2">
              <div>
                <div className="font-medium text-sm">
                  Edit selected rollup/calculation node
                </div>
                <p className="text-muted-foreground text-xs">
                  Select a node in the cascade, change its grouping or
                  operation, then save it.
                </p>
              </div>
              <Button
                disabled={disabled}
                onClick={upsertDraftRule}
                size="sm"
                type="button"
                variant="secondary"
              >
                Save node
              </Button>
            </div>
            <div className="rounded-md bg-background/50 p-3 sm:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-muted/50 px-2 py-0.5 text-[10px] uppercase">
                  {draftModeLabel}
                </span>
                <span className="font-medium text-sm">Current mode</span>
              </div>
              <p className="mt-2 text-muted-foreground text-xs">
                {draftModeDescription}
              </p>
              <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
                {Object.entries(AGGREGATION_RULE_MODE_DESCRIPTIONS).map(
                  ([mode, description]) => (
                    <div className="rounded-md bg-muted/20 p-2" key={mode}>
                      <div className="font-medium text-[10px] uppercase">
                        {mode.replaceAll("_", " ")}
                      </div>
                      <div className="mt-1 text-muted-foreground text-xs">
                        {description}
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="mt-3 text-muted-foreground text-xs">
                Supported operations:{" "}
                <span className="font-medium text-foreground">
                  {SUPPORTED_AGGREGATION_OPERATIONS.join(", ")}
                </span>
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="ml-1">Selected node</Label>
              <Select
                disabled={disabled || rules.length === 0}
                onValueChange={setSelectedRuleNodeId}
                value={
                  selectedNodeId === NEW_AGGREGATION_RULE_NODE_ID ||
                  !rules.some((rule) => String(rule.nodeId) === selectedNodeId)
                    ? undefined
                    : selectedNodeId
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an aggregation node" />
                </SelectTrigger>
                <SelectContent>
                  {rules.map((rule) => (
                    <SelectItem
                      key={String(rule.nodeId)}
                      value={String(rule.nodeId)}
                    >
                      {String(rule.nodeId)} - {String(rule.label || "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="ml-1">Node ID</Label>
              <Input
                disabled={disabled}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    nodeId: event.target.value,
                  }))
                }
                value={draft.nodeId}
              />
            </div>
            <div>
              <Label className="ml-1">Label</Label>
              <Input
                disabled={disabled}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    label: event.target.value,
                  }))
                }
                value={draft.label}
              />
            </div>
            <div className="space-y-2">
              <Label className="ml-1">Node type</Label>
              <Select
                disabled={disabled}
                onValueChange={(value) =>
                  setDraft((current) => ({ ...current, nodeType: value }))
                }
                value={draft.nodeType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Node type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category_total">category_total</SelectItem>
                  <SelectItem value="group">group</SelectItem>
                  <SelectItem value="final_result">final_result</SelectItem>
                  <SelectItem value="constant">constant</SelectItem>
                  <SelectItem value="formula">formula</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="ml-1">Operation</Label>
              <Select
                disabled={disabled}
                onValueChange={(value) =>
                  setDraft((current) => ({ ...current, operation: value }))
                }
                value={draft.operation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Operation" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_AGGREGATION_OPERATIONS.map((operation) => (
                    <SelectItem key={operation} value={operation}>
                      {operation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {showConstantFields && (
              <div className="space-y-2">
                <Label className="ml-1">Constant value</Label>
                <Input
                  disabled={disabled}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      value: event.target.value,
                    }))
                  }
                  type="number"
                  value={draft.value}
                />
              </div>
            )}
            {showResultFields && (
              <>
                <div className="space-y-2">
                  <Label className="ml-1">Result name</Label>
                  <Input
                    disabled={disabled}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        resultName: event.target.value,
                      }))
                    }
                    placeholder="NET_FAPI"
                    value={draft.resultName}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="ml-1">Output role</Label>
                  <Input
                    disabled={disabled}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        outputRole: event.target.value,
                      }))
                    }
                    placeholder="official_line"
                    value={draft.outputRole}
                  />
                </div>
              </>
            )}
            <div className="space-y-2 sm:col-span-2">
              <Label className="ml-1">Description</Label>
              <Input
                disabled={disabled}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                value={draft.description}
              />
            </div>
            <div className="space-y-4 rounded-md bg-background/50 p-3 sm:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-medium text-sm">
                    <Calculator className="size-4" />
                    Calculator builder
                  </div>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Build rollups by picking categories, existing nodes, and
                    number terms. Save the node when the preview looks right.
                  </p>
                </div>
                <div className="rounded-md bg-muted/40 px-3 py-2 font-mono text-xs">
                  {formulaPreview}
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div
                  className={cn(
                    "space-y-2 rounded-md bg-muted/20 p-3",
                    !showRollupFields && "opacity-70"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-medium text-xs uppercase">
                        Category rollup
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Use this for rollup nodes. Categories and child nodes
                        become subtotals through sum-style operations.
                      </p>
                    </div>
                    <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase">
                      {selectedCategoryIds.length} selected
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedCategoryIds.length === 0 ? (
                      <span className="text-muted-foreground text-xs">
                        No categories selected yet.
                      </span>
                    ) : (
                      selectedCategoryIds.map((categoryId) => (
                        <Button
                          disabled={disabled}
                          key={categoryId}
                          onClick={() =>
                            removeCategoryFromRollup(
                              selectedCategoryIds.indexOf(categoryId)
                            )
                          }
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          {humanizeRuleId(categoryId)}
                          <span className="ml-2 text-muted-foreground">
                            Remove
                          </span>
                        </Button>
                      ))
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-muted-foreground text-xs">
                      Available categories
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categoryOptions.length === 0 ? (
                        <span className="text-muted-foreground text-xs">
                          Add a category ID below to start this rulebook.
                        </span>
                      ) : (
                        categoryOptions.map((categoryId) => (
                          <Button
                            disabled={
                              disabled ||
                              selectedCategoryIds.includes(categoryId)
                            }
                            key={categoryId}
                            onClick={() => addCategoryToRollup(categoryId)}
                            size="sm"
                            type="button"
                            variant="secondary"
                          >
                            <Plus className="mr-1 size-3" />
                            {humanizeRuleId(categoryId)}
                          </Button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      disabled={disabled}
                      onChange={(event) =>
                        setCustomCategoryId(event.target.value)
                      }
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
                      disabled={disabled || !customCategoryId.trim()}
                      onClick={addCustomCategory}
                      type="button"
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div
                  className={cn(
                    "space-y-2 rounded-md bg-muted/20 p-3",
                    !showFormulaFields && "opacity-70"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-medium text-xs uppercase">
                        Formula expression
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Use this for formula, final result, and official line
                        nodes. Mix categories, nodes, inputs, and numbers.
                      </p>
                    </div>
                    <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase">
                      {draft.formulaExpression.trim() ? "formula" : "rollup"}
                    </span>
                  </div>

                  <Input
                    disabled={disabled}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        formulaExpression: event.target.value,
                        nodeType:
                          current.nodeType === "group"
                            ? "formula"
                            : current.nodeType,
                      }))
                    }
                    placeholder="category:interest_income + node:expense_base - 1.5 * category:service_income"
                    value={draft.formulaExpression}
                  />

                  <div className="flex flex-wrap gap-2">
                    {["+", "-", "*", "/", "(", ")"].map((operator) => (
                      <Button
                        disabled={disabled}
                        key={operator}
                        onClick={() => appendFormulaToken(operator)}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        {operator}
                      </Button>
                    ))}
                    <Button
                      disabled={disabled || !draft.formulaExpression.trim()}
                      onClick={clearFormulaExpression}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      Clear formula
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="text-muted-foreground text-xs">
                      Add category terms
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categoryOptions.map((categoryId) => (
                        <Button
                          disabled={disabled}
                          key={`operand-${categoryId}`}
                          onClick={() =>
                            appendFormulaToken(`category:${categoryId}`)
                          }
                          size="sm"
                          type="button"
                          variant="secondary"
                        >
                          <Plus className="mr-1 size-3" />
                          {humanizeRuleId(categoryId)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-muted-foreground text-xs">
                      Add existing node terms
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {nodeOptions.length === 0 ? (
                        <span className="text-muted-foreground text-xs">
                          Create another node to reference it here.
                        </span>
                      ) : (
                        nodeOptions.map((option) => (
                          <Button
                            disabled={disabled}
                            key={`node-${option.id}`}
                            onClick={() =>
                              appendFormulaToken(`node:${option.id}`)
                            }
                            size="sm"
                            type="button"
                            variant="secondary"
                          >
                            <Plus className="mr-1 size-3" />
                            {option.label || option.id}
                          </Button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      disabled={disabled}
                      onChange={(event) => setConstantTerm(event.target.value)}
                      placeholder="Number"
                      type="number"
                      value={constantTerm}
                    />
                    <Button
                      disabled={disabled}
                      onClick={addConstantOperand}
                      type="button"
                      variant="outline"
                    >
                      Add number
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <details className="space-y-2 rounded-md bg-background/40 p-3 sm:col-span-2">
              <summary className="cursor-pointer font-medium text-sm">
                Advanced node fields
              </summary>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["includeCategoryIds", "Include category IDs"],
                    ["children", "Children"],
                    ["formulaExpression", "Formula expression"],
                    ["operands", "Raw operands"],
                    ["outputRole", "Output role"],
                    ["order", "Order"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <Label className="ml-1">{label}</Label>
                    <Input
                      disabled={disabled}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      value={draft[key]}
                    />
                  </div>
                ))}
              </div>
            </details>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              disabled={disabled || !selectedRule}
              onClick={duplicateSelectedRule}
              size="sm"
              type="button"
              variant="outline"
            >
              Duplicate node
            </Button>
            <Button
              disabled={disabled || !selectedRule}
              onClick={deleteSelectedRule}
              size="sm"
              type="button"
              variant="outline"
            >
              <Trash2 className="mr-2 size-3.5" />
              Delete draft node
            </Button>
          </div>

          <details className="space-y-2 rounded-md bg-muted/10 p-3">
            <summary className="cursor-pointer font-medium text-sm">
              Advanced JSON import / export
            </summary>
            <Label className="ml-1">Advanced aggregation rulebook JSON</Label>
            <textarea
              className="min-h-28 w-full rounded-md border bg-background px-3 py-2 font-mono text-xs outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={disabled}
              onChange={(event) => setImportText(event.target.value)}
              spellCheck={false}
              value={importText}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={disabled}
                onClick={importRules}
                size="sm"
                type="button"
                variant="secondary"
              >
                Import rulebook JSON
              </Button>
              <Button
                disabled={disabled}
                onClick={copyRules}
                size="sm"
                type="button"
                variant="outline"
              >
                <Copy className="mr-2 size-3.5" />
                Export rulebook JSON
              </Button>
            </div>
          </details>
        </>
      )}
    </div>
  );
}

function RollupRuleSourceViewerAside({
  config,
  disabled,
  onCreateItem,
  onSelectItem,
  selectedItemId,
}: {
  config: Record<string, unknown>;
  disabled?: boolean;
  onCreateItem?: () => void;
  onSelectItem?: (itemId: string) => void;
  selectedItemId?: string;
}) {
  const rules = getRollupRules(config);
  const cascadeRules = getRollupCascadeRules(rules);
  const selectedCategoryId = getSelectedRollupCategoryId(selectedItemId);
  const selectedCategoryParent = selectedCategoryId
    ? rules.find((rule) =>
        asStringList(rule.includeCategoryIds).includes(selectedCategoryId)
      )
    : undefined;
  const selectedNodeId =
    String(asRecord(selectedCategoryParent)?.rollupId || "") || selectedItemId;

  return (
    <aside className="flex min-h-0 flex-col gap-3 overflow-hidden bg-card/50 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-sm">Rollup rulebook</div>
          <div className="text-muted-foreground text-xs">
            Groups mapped categories into rollup totals.
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase">
            {rules.length} rules
          </span>
          {onCreateItem && (
            <Button
              className="h-7 px-2 text-xs"
              disabled={disabled}
              onClick={onCreateItem}
              size="sm"
              type="button"
              variant="secondary"
            >
              <Plus className="mr-1 size-3" />
              New
            </Button>
          )}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <AggregationRulesOverview
          className="h-full"
          emptyMessage="No rollup rules are defined yet."
          fill
          modeBadges={[{ label: "Rollups", mode: "rollup" }]}
          onSelectCategory={
            onSelectItem
              ? (categoryId) =>
                  onSelectItem(getRollupCategorySelectionId(categoryId))
              : undefined
          }
          onSelectRule={onSelectItem}
          rules={cascadeRules}
          selectedCategoryId={selectedCategoryId}
          selectedNodeId={selectedCategoryId ? undefined : selectedNodeId}
          summaryDescription="Select a rollup or included category to edit its grouping in the center pane."
          summaryTitle="Rollup cascade"
          supportedOperationsText="Supported rollup operations: sum, sum_abs."
        />
      </div>
    </aside>
  );
}

function CalculationRuleSourceViewerAside({
  config,
  disabled,
  onCreateItem,
  onSelectItem,
  selectedItemId,
}: {
  config: Record<string, unknown>;
  disabled?: boolean;
  onCreateItem?: () => void;
  onSelectItem?: (itemId: string) => void;
  selectedItemId?: string;
}) {
  const rules = getCalculationRules(config);

  return (
    <aside className="flex min-h-0 flex-col gap-3 overflow-hidden bg-card/50 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-sm">Calculation rulebook</div>
          <div className="text-muted-foreground text-xs">
            Select a result or formula to edit it in the workspace.
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase">
            {rules.length} rules
          </span>
          {onCreateItem && (
            <Button
              className="h-7 px-2 text-xs"
              disabled={disabled}
              onClick={onCreateItem}
              size="sm"
              type="button"
              variant="secondary"
            >
              <Plus className="mr-1 size-3" />
              New
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-background/70 p-2 text-center">
          <div className="font-semibold text-sm">{rules.length}</div>
          <div className="text-[10px] text-muted-foreground uppercase">
            Results
          </div>
        </div>
        <div className="rounded-md bg-background/70 p-2 text-center">
          <div className="font-semibold text-sm">
            {new Set(rules.map((rule) => String(rule.operation || ""))).size}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase">
            Operations
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-1">
        {rules.map((rule) => {
          const calculationId = getCalculationRuleId(rule);
          return (
            <RulebookOutlineRow
              badge={String(rule.operation || "formula")}
              description={String(rule.description || "")}
              id={calculationId}
              key={calculationId}
              label={String(rule.label || rule.resultKey || calculationId)}
              onSelect={
                onSelectItem ? () => onSelectItem(calculationId) : undefined
              }
              selected={selectedItemId === calculationId}
            />
          );
        })}
      </div>
    </aside>
  );
}

export function RuleSourceViewer({
  config,
  disabled,
  onCreateItem,
  onSelectItem,
  selectedItemId,
}: {
  config: Record<string, unknown>;
  disabled?: boolean;
  onCreateItem?: () => void;
  onSelectItem?: (itemId: string) => void;
  selectedItemId?: string;
}) {
  const sourceKind = String(config.sourceKind || "").toLowerCase();
  const aggregationRules = getAggregationRules(config);
  if (sourceKind.includes("rollup_rules")) {
    return (
      <RollupRuleSourceViewerAside
        config={config}
        disabled={disabled}
        onCreateItem={onCreateItem}
        onSelectItem={onSelectItem}
        selectedItemId={selectedItemId}
      />
    );
  }

  if (sourceKind.includes("calculation_rules")) {
    return (
      <CalculationRuleSourceViewerAside
        config={config}
        disabled={disabled}
        onCreateItem={onCreateItem}
        onSelectItem={onSelectItem}
        selectedItemId={selectedItemId}
      />
    );
  }

  if (sourceKind.includes("aggregation_rules")) {
    const finalResults = aggregationRules.filter(
      (rule) => rule.nodeType === "final_result"
    );
    const groups = aggregationRules.filter((rule) => rule.nodeType === "group");
    const formulas = aggregationRules.filter(
      (rule) => rule.nodeType === "formula"
    );
    const selectedCategoryId = getSelectedAggregationCategoryId(selectedItemId);

    return (
      <aside className="flex min-h-0 flex-col gap-3 overflow-hidden bg-card/50 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-sm">Rulebook outline</div>
            <div className="text-muted-foreground text-xs">
              Select a node to edit it in the workspace.
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase">
              {aggregationRules.length} nodes
            </span>
            {onCreateItem && (
              <Button
                className="h-7 px-2 text-xs"
                disabled={disabled}
                onClick={onCreateItem}
                size="sm"
                type="button"
                variant="secondary"
              >
                <Plus className="mr-1 size-3" />
                New
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-md bg-background/70 p-2 text-center">
            <div className="font-semibold text-sm">{finalResults.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase">
              Final
            </div>
          </div>
          <div className="rounded-md bg-background/70 p-2 text-center">
            <div className="font-semibold text-sm">{groups.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase">
              Groups
            </div>
          </div>
          <div className="rounded-md bg-background/70 p-2 text-center">
            <div className="font-semibold text-sm">{formulas.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase">
              Formulas
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <AggregationRulesOverview
            className="h-full"
            fill
            onSelectCategory={
              onSelectItem
                ? (categoryId) =>
                    onSelectItem(getAggregationCategorySelectionId(categoryId))
                : undefined
            }
            onSelectRule={onSelectItem}
            rules={aggregationRules}
            selectedCategoryId={selectedCategoryId}
            selectedNodeId={selectedCategoryId ? undefined : selectedItemId}
          />
        </div>
      </aside>
    );
  }

  const rules = getKeywordRules(config);

  return (
    <aside className="flex min-h-0 flex-col gap-3 overflow-hidden bg-card/50 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-sm">Rulebook outline</div>
          <div className="text-muted-foreground text-xs">
            Categories at a glance. Edit details in the center pane.
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase">
            {rules.length} rules
          </span>
          {onCreateItem && (
            <Button
              className="h-7 px-2 text-xs"
              disabled={disabled}
              onClick={onCreateItem}
              size="sm"
              type="button"
              variant="secondary"
            >
              <Plus className="mr-1 size-3" />
              New
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md bg-background/70 p-3">
        <div className="font-semibold text-lg">{rules.length}</div>
        <div className="text-muted-foreground text-xs uppercase">
          Atomic categories
        </div>
        <div className="mt-2 text-muted-foreground text-xs">
          Keyword Mapper consumes these categories. Final rollups are defined in
          the Aggregation Rulebook.
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-1">
        {rules.map((rule) => {
          const categoryId = String(rule.categoryId || rule.target || "");
          return (
            <RulebookOutlineRow
              badge={`${getKeywordRuleKeywordCount(rule)} keywords`}
              description={String(rule.description || "")}
              id={String(rule.ruleId || categoryId)}
              key={String(rule.ruleId || categoryId)}
              label={String(rule.categoryLabel || rule.label || categoryId)}
              onSelect={
                onSelectItem
                  ? () => onSelectItem(String(rule.ruleId || categoryId))
                  : undefined
              }
              selected={selectedItemId === String(rule.ruleId || categoryId)}
            />
          );
        })}
      </div>
    </aside>
  );
}

function getKeywordRuleKeywordCount(rule: Record<string, unknown>) {
  return new Set([
    ...asStringList(rule.exactKeywords),
    ...asStringList(rule.containsKeywords),
    ...asStringList(rule.keywords),
    ...asStringList(rule.excludeKeywords),
  ]).size;
}

function getBlockLabel(nodes: WorkflowNode[], blockId: string) {
  return (
    nodes.find((node) => node.id === blockId)?.data.block?.label || blockId
  );
}

function RulebookOutlineRow({
  badge,
  description,
  id,
  label,
  onSelect,
  selected,
}: {
  badge?: string;
  description?: string;
  id: string;
  label: string;
  onSelect?: () => void;
  selected?: boolean;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-medium text-sm">{label}</div>
          <div className="truncate font-mono text-[11px] text-muted-foreground">
            {id}
          </div>
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] uppercase">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <div className="mt-1 line-clamp-2 text-muted-foreground text-xs">
          {description}
        </div>
      )}
    </>
  );

  if (onSelect) {
    return (
      <button
        className={cn(
          "w-full rounded-md bg-background/70 p-2 text-left transition-colors hover:bg-background",
          selected && "bg-primary/10 ring-1 ring-primary/25"
        )}
        onClick={onSelect}
        type="button"
      >
        {content}
      </button>
    );
  }

  return <div className="rounded-md bg-background/70 p-2">{content}</div>;
}

export function KeywordMapperRulesPanel({
  block,
  edges,
  nodes,
  onOpenRuleSource,
}: {
  block: WorkflowBlock;
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  onOpenRuleSource: (nodeId: string) => void;
}) {
  const ruleEdge = edges.find(
    (edge) =>
      edge.target === block.id &&
      edge.data?.workflowEdge?.targetInputRole === "keyword_rules"
  );
  const ruleNode = ruleEdge
    ? nodes.find((node) => node.id === ruleEdge.source)
    : undefined;
  const ruleBlock = ruleNode?.data.block;
  const rules = ruleBlock ? getKeywordRules(ruleBlock.config || {}) : [];

  return (
    <div className="space-y-3 rounded-md border bg-muted/20 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-sm">Connected Keyword Rulebook</div>
          <p className="mt-1 text-muted-foreground text-xs">
            Keyword Mapper reads categories and keywords from the connected
            rulebook. Edits should happen on that rulebook.
          </p>
        </div>
        {ruleNode && (
          <Button
            onClick={() => onOpenRuleSource(ruleNode.id)}
            size="sm"
            type="button"
            variant="secondary"
          >
            <ExternalLink className="mr-2 size-3.5" />
            Open rulebook
          </Button>
        )}
      </div>
      {ruleBlock ? (
        <>
          <div className="text-muted-foreground text-xs">
            Rulebook: {getBlockLabel(nodes, ruleBlock.id)} |{" "}
            {ruleEdge?.data?.workflowEdge?.sourceOutputRole || "keyword_rules"}
          </div>
          <RulesTable compact rules={rules} />
        </>
      ) : (
        <div className="rounded-md border bg-background/70 p-3 text-muted-foreground text-xs">
          No Keyword Rulebook is connected to the keyword_rules input.
        </div>
      )}
    </div>
  );
}
