"use client";

import { BookMarked, BookOpen, Copy, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getRulebookEntries,
  removeFromRulebook,
  saveToRulebook,
  type RulebookKeywordRule,
} from "@/lib/keyword-rulebook-store";
import { cn } from "@/lib/utils";

const DEFAULT_SCOPE = "company";
const KEYWORD_LIST_DELIMITER_REGEX = /[,;\n|]/;
const KEYWORD_BUCKETS = [
  {
    description: "Exact phrases must match the normalized row text exactly.",
    field: "exactKeywords",
    label: "Exact",
  },
  {
    description: "Contains phrases can appear anywhere in the row text.",
    field: "containsKeywords",
    label: "Contains",
  },
  {
    description: "Exclude phrases prevent a category match when present.",
    field: "excludeKeywords",
    label: "Exclude",
  },
] as const;

type KeywordBucketField = (typeof KEYWORD_BUCKETS)[number]["field"];

// ── Helpers ──────────────────────────────────────────────────────────────────

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(KEYWORD_LIST_DELIMITER_REGEX))
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(KEYWORD_LIST_DELIMITER_REGEX)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function asNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function getRuleId(rule: Record<string, unknown>) {
  return String(rule.ruleId || "").trim();
}

function getCategoryId(rule: Record<string, unknown>) {
  return String(rule.categoryId || rule.category || "").trim();
}

function makeRuleId(categoryId: string, index: number) {
  const normalized = categoryId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `rule-${normalized || String(index + 1).padStart(3, "0")}`;
}

function getKeywordBuckets(rule: Record<string, unknown>) {
  const explicitExact = asStringArray(rule.exactKeywords);
  const explicitContains = asStringArray(rule.containsKeywords);
  const excludeKeywords = asStringArray(rule.excludeKeywords);
  const legacyKeywords = asStringArray(rule.keywords);
  const hasExplicitBuckets = explicitExact.length + explicitContains.length > 0;

  if (hasExplicitBuckets) {
    return {
      containsKeywords: explicitContains,
      exactKeywords: explicitExact,
      excludeKeywords,
    };
  }

  if (rule.matchMode === "exact") {
    return {
      containsKeywords: [],
      exactKeywords: legacyKeywords,
      excludeKeywords,
    };
  }

  return {
    containsKeywords: legacyKeywords,
    exactKeywords: [],
    excludeKeywords,
  };
}

function normalizeRule(rule: Record<string, unknown>, index: number) {
  const categoryId =
    getCategoryId(rule) || `category_${String(index + 1).padStart(3, "0")}`;
  const buckets = getKeywordBuckets(rule);
  const keywords = [...buckets.exactKeywords, ...buckets.containsKeywords];

  return {
    ...rule,
    _rulebookId: rule._rulebookId as string | undefined,
    categoryId,
    categoryLabel: String(rule.categoryLabel || rule.label || categoryId),
    confidence: asNumber(rule.confidence, 0.9),
    exactKeywords: buckets.exactKeywords,
    containsKeywords: buckets.containsKeywords,
    excludeKeywords: buckets.excludeKeywords,
    keywords,
    matchMode:
      buckets.exactKeywords.length > 0 && buckets.containsKeywords.length === 0
        ? "exact"
        : "contains",
    priority: asNumber(rule.priority, index + 1),
    ruleId: getRuleId(rule) || makeRuleId(categoryId, index),
    scope: String(rule.scope || DEFAULT_SCOPE),
  };
}

function normalizeRules(rules: Record<string, unknown>[]) {
  return rules.map(normalizeRule);
}

function getKeywordCount(rule: Record<string, unknown>) {
  const buckets = getKeywordBuckets(rule);
  return (
    buckets.exactKeywords.length +
    buckets.containsKeywords.length +
    buckets.excludeKeywords.length
  );
}

function patchRuleKeywords({
  field,
  keyword,
  mode,
  rule,
}: {
  field: KeywordBucketField;
  keyword: string;
  mode: "add" | "remove";
  rule: Record<string, unknown>;
}) {
  const buckets = getKeywordBuckets(rule);
  const current = buckets[field];
  const keywordsToAdd = asStringArray(keyword);
  const nextKeywords =
    mode === "add"
      ? [...new Set([...current, ...keywordsToAdd].filter(Boolean))]
      : current.filter((item) => item !== keyword);
  const nextBuckets = { ...buckets, [field]: nextKeywords };

  return normalizeRule(
    {
      ...rule,
      containsKeywords: nextBuckets.containsKeywords,
      exactKeywords: nextBuckets.exactKeywords,
      excludeKeywords: nextBuckets.excludeKeywords,
      keywords: [...nextBuckets.exactKeywords, ...nextBuckets.containsKeywords],
    },
    0
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function KeywordChip({
  disabled,
  keyword,
  onDelete,
}: {
  disabled?: boolean;
  keyword: string;
  onDelete: () => void;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs">
      <span className="truncate">{keyword}</span>
      {!disabled && (
        <button
          className="rounded text-muted-foreground hover:text-foreground"
          onClick={onDelete}
          type="button"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}

function KeywordBucket({
  disabled,
  field,
  label,
  onAddKeyword,
  onRemoveKeyword,
  rule,
}: {
  disabled?: boolean;
  field: KeywordBucketField;
  label: string;
  onAddKeyword: (field: KeywordBucketField, keyword: string) => void;
  onRemoveKeyword: (field: KeywordBucketField, keyword: string) => void;
  rule: Record<string, unknown>;
}) {
  const [value, setValue] = useState("");
  const keywords = getKeywordBuckets(rule)[field];
  const addKeyword = () => {
    if (!value.trim()) return;
    onAddKeyword(field, value);
    setValue("");
  };

  return (
    <div className="space-y-2 rounded-md border bg-background/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-medium text-xs uppercase">{label}</div>
          <div className="text-[11px] text-muted-foreground">
            {keywords.length} keyword{keywords.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {keywords.length === 0 ? (
          <span className="text-muted-foreground text-xs">None yet.</span>
        ) : (
          keywords.map((keyword) => (
            <KeywordChip
              disabled={disabled}
              key={keyword}
              keyword={keyword}
              onDelete={() => onRemoveKeyword(field, keyword)}
            />
          ))
        )}
      </div>
      {!disabled && (
        <div className="flex gap-2">
          <Input
            className="h-8 text-xs"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addKeyword();
              }
            }}
            placeholder={`Add ${label.toLowerCase()} keyword`}
            value={value}
          />
          <Button
            className="h-8 px-2"
            onClick={addKeyword}
            size="sm"
            type="button"
            variant="secondary"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

/** Left-panel category list item */
function CategoryListItem({
  onClick,
  rule,
  selected,
  source,
}: {
  onClick: () => void;
  rule: Record<string, unknown>;
  selected: boolean;
  source: "local" | "rulebook";
}) {
  const label = String(rule.categoryLabel || getCategoryId(rule));
  const count = getKeywordCount(rule);

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between gap-1.5 rounded px-2 py-1.5 text-left transition-colors",
        selected
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
      onClick={onClick}
      type="button"
    >
      <span className="truncate text-xs">{label}</span>
      <span
        className={cn(
          "shrink-0 rounded px-1.5 py-0.5 text-[10px]",
          source === "rulebook"
            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            : "bg-muted/60"
        )}
      >
        {count}
      </span>
    </button>
  );
}

/** Middle-panel: always-expanded category editor */
function CategoryEditor({
  disabled,
  onAddKeyword,
  onDelete,
  onDuplicate,
  onRemoveKeyword,
  onSaveToRulebook,
  onUpdate,
  rule,
  source,
}: {
  disabled?: boolean;
  onAddKeyword: (field: KeywordBucketField, keyword: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onRemoveKeyword: (field: KeywordBucketField, keyword: string) => void;
  onSaveToRulebook: () => void;
  onUpdate: (patch: Record<string, unknown>) => void;
  rule: Record<string, unknown>;
  source: "local" | "rulebook";
}) {
  const ruleId = getRuleId(rule);
  const categoryId = getCategoryId(rule);
  const categoryLabel = String(rule.categoryLabel || categoryId);
  const confidence = asNumber(rule.confidence, 0.9);
  const priority = asNumber(rule.priority, 1);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-sm">{categoryLabel}</div>
          <code className="mt-0.5 block text-[11px] text-muted-foreground">
            {categoryId}
          </code>
        </div>
        {source === "rulebook" && (
          <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            From Rulebook
          </span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Category ID</Label>
          <Input
            className="h-8 text-xs"
            disabled={disabled}
            onChange={(e) => onUpdate({ categoryId: e.target.value })}
            value={categoryId}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Category label</Label>
          <Input
            className="h-8 text-xs"
            disabled={disabled}
            onChange={(e) => onUpdate({ categoryLabel: e.target.value })}
            value={categoryLabel}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Confidence</Label>
          <Input
            className="h-8 text-xs"
            disabled={disabled}
            onChange={(e) => onUpdate({ confidence: Number(e.target.value) })}
            step="0.01"
            type="number"
            value={String(confidence)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Priority</Label>
          <Input
            className="h-8 text-xs"
            disabled={disabled}
            onChange={(e) => onUpdate({ priority: Number(e.target.value) })}
            type="number"
            value={String(priority)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Scope</Label>
          <Select
            disabled={disabled}
            onValueChange={(scope) => onUpdate({ scope })}
            value={String(rule.scope || DEFAULT_SCOPE)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">company</SelectItem>
              <SelectItem value="country">country</SelectItem>
              <SelectItem value="affiliate_exception">
                affiliate exception
              </SelectItem>
              <SelectItem value="global">global</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Description</Label>
          <Input
            className="h-8 text-xs"
            disabled={disabled}
            onChange={(e) => onUpdate({ description: e.target.value })}
            value={String(rule.description || "")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Keywords
        </div>
        <div className="grid gap-3 xl:grid-cols-3">
          {KEYWORD_BUCKETS.map((bucket) => (
            <KeywordBucket
              disabled={disabled}
              field={bucket.field}
              key={bucket.field}
              label={bucket.label}
              onAddKeyword={onAddKeyword}
              onRemoveKeyword={onRemoveKeyword}
              rule={rule}
            />
          ))}
        </div>
      </div>

      {!disabled && (
        <div className="flex flex-wrap gap-2 border-t pt-3">
          <Button
            onClick={onDuplicate}
            size="sm"
            type="button"
            variant="outline"
          >
            <Copy className="mr-1.5 size-3.5" />
            Duplicate
          </Button>
          <Button onClick={onDelete} size="sm" type="button" variant="outline">
            <Trash2 className="mr-1.5 size-3.5" />
            Delete
          </Button>
          {source === "local" && (
            <Button
              onClick={onSaveToRulebook}
              size="sm"
              type="button"
              variant="outline"
            >
              <BookMarked className="mr-1.5 size-3.5" />
              Save to Rulebook
            </Button>
          )}
        </div>
      )}

      <div className="text-[10px] text-muted-foreground">Rule ID: {ruleId}</div>
    </div>
  );
}

/** Right-panel: keyword summary for the selected category */
function CategorySummaryPanel({ rule }: { rule: Record<string, unknown> }) {
  const confidence = asNumber(rule.confidence, 0.9);
  const priority = asNumber(rule.priority, 1);
  const scope = String(rule.scope || DEFAULT_SCOPE);
  const buckets = getKeywordBuckets(rule);
  const totalKeywords = getKeywordCount(rule);

  return (
    <div className="space-y-4 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Summary
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-medium">{Math.round(confidence * 100)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
        <span className="text-muted-foreground">Priority</span>
        <span className="text-right font-medium">{priority}</span>
        <span className="text-muted-foreground">Scope</span>
        <span className="text-right font-medium">{scope}</span>
        <span className="text-muted-foreground">Total kw</span>
        <span className="text-right font-medium">{totalKeywords}</span>
      </div>

      <div className="space-y-3">
        {buckets.exactKeywords.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Exact
            </div>
            <div className="flex flex-wrap gap-1">
              {buckets.exactKeywords.map((kw) => (
                <span
                  className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px]"
                  key={kw}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {buckets.containsKeywords.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Contains
            </div>
            <div className="flex flex-wrap gap-1">
              {buckets.containsKeywords.map((kw) => (
                <span
                  className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px]"
                  key={kw}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {buckets.excludeKeywords.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Exclude
            </div>
            <div className="flex flex-wrap gap-1">
              {buckets.excludeKeywords.map((kw) => (
                <span
                  className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-700 dark:bg-red-950/50 dark:text-red-400"
                  key={kw}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {totalKeywords === 0 && (
          <div className="py-4 text-center text-xs text-muted-foreground">
            No keywords yet.
            <br />
            Add them in the editor.
          </div>
        )}
      </div>
    </div>
  );
}

/** Dialog to browse saved rulebook entries and add them to the current block */
function RulebookBrowserDialog({
  existingCategoryIds,
  onClose,
  onImport,
}: {
  existingCategoryIds: string[];
  onClose: () => void;
  onImport: (entry: RulebookKeywordRule) => void;
}) {
  const [entries, setEntries] = useState<RulebookKeywordRule[]>(() =>
    getRulebookEntries()
  );

  const handleDelete = (id: string) => {
    removeFromRulebook(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Removed from rulebook");
  };

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="size-4" />
            Keyword Rulebook
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto">
          {entries.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No saved rules yet.
              <br />
              Use &ldquo;Save to Rulebook&rdquo; in the editor to add rules
              here.
            </div>
          )}

          {entries.map((entry) => {
            const isApplied = existingCategoryIds.includes(entry.categoryId);
            const totalKw =
              entry.exactKeywords.length + entry.containsKeywords.length;
            const preview = [
              ...entry.exactKeywords,
              ...entry.containsKeywords,
            ].slice(0, 8);
            const overflow = totalKw - preview.length;

            return (
              <div className="space-y-2 rounded-md border p-3" key={entry.id}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-sm">
                      {entry.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {entry.categoryId} &bull; {totalKw} keywords &bull;{" "}
                      {Math.round(entry.confidence * 100)}% confidence
                    </div>
                    {entry.description && (
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {entry.description}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      className="rounded p-1 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(entry.id)}
                      title="Remove from rulebook"
                      type="button"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                    {isApplied ? (
                      <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                        Applied
                      </span>
                    ) : (
                      <Button
                        className="h-7 px-2 text-xs"
                        onClick={() => onImport(entry)}
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        Add to block
                      </Button>
                    )}
                  </div>
                </div>

                {preview.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    {preview.map((kw) => (
                      <span
                        className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px]"
                        key={kw}
                      >
                        {kw}
                      </span>
                    ))}
                    {overflow > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{overflow} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function KeywordRulebookEditor({
  disabled,
  onRulesChange,
  onSelectedRuleIdChange,
  rules,
  selectedRuleId: controlledSelectedRuleId,
  showCategoryList = true,
  sourceVersion,
}: {
  disabled?: boolean;
  onRulesChange: (rules: Record<string, unknown>[]) => void;
  onSelectedRuleIdChange?: (ruleId: string) => void;
  rules: Record<string, unknown>[];
  selectedRuleId?: string;
  showCategoryList?: boolean;
  sourceVersion: number;
}) {
  const normalizedRules = normalizeRules(rules);
  const localRules = normalizedRules.filter((r) => !r._rulebookId);
  const rulebookRules = normalizedRules.filter((r) => !!r._rulebookId);

  const [localSelectedRuleId, setLocalSelectedRuleId] = useState(() =>
    getRuleId(normalizedRules[0] || {})
  );
  const selectedRuleId = controlledSelectedRuleId || localSelectedRuleId;
  const selectedRule =
    normalizedRules.find((r) => getRuleId(r) === selectedRuleId) ?? null;
  const selectedRuleSource = selectedRule?._rulebookId ? "rulebook" : "local";

  const [showRulebookBrowser, setShowRulebookBrowser] = useState(false);

  const selectRule = useCallback(
    (ruleId: string) => {
      setLocalSelectedRuleId(ruleId);
      onSelectedRuleIdChange?.(ruleId);
    },
    [onSelectedRuleIdChange]
  );

  // addCategory is redefined each render; use a ref so the effect below
  // always calls the latest version without needing it as a dependency.
  const addCategoryRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (
      normalizedRules.length > 0 &&
      !normalizedRules.some((rule) => getRuleId(rule) === selectedRuleId)
    ) {
      selectRule(getRuleId(normalizedRules[0]));
    }
  }, [normalizedRules, selectedRuleId, selectRule]);

  const patchRules = (nextRules: Record<string, unknown>[]) => {
    onRulesChange(normalizeRules(nextRules));
  };

  const updateRule = (
    ruleId: string,
    patch: Record<string, unknown>,
    index: number
  ) => {
    patchRules(
      normalizedRules.map((rule, ruleIndex) =>
        getRuleId(rule) === ruleId
          ? normalizeRule({ ...rule, ...patch }, index ?? ruleIndex)
          : rule
      )
    );
  };

  const addCategory = () => {
    const index = normalizedRules.length;
    const nextRule = normalizeRule(
      {
        categoryId: `new_category_${String(index + 1).padStart(3, "0")}`,
        categoryLabel: "New Category",
        confidence: 0.85,
        containsKeywords: [],
        description: "",
        exactKeywords: [],
        excludeKeywords: [],
        priority: index + 1,
        ruleVersion: `v${sourceVersion}`,
        scope: DEFAULT_SCOPE,
      },
      index
    );
    patchRules([...normalizedRules, nextRule]);
    selectRule(getRuleId(nextRule));
    toast.success("Category added");
  };

  // Keep ref up to date so the sentinel effect always calls the latest addCategory
  addCategoryRef.current = addCategory;

  // When the parent signals "new keyword rule" via the sentinel ID, create one
  useEffect(() => {
    if (controlledSelectedRuleId === "__new_keyword_rule__") {
      addCategoryRef.current?.();
    }
  }, [controlledSelectedRuleId]);

  const duplicateCategory = (rule: Record<string, unknown>, index: number) => {
    const copy = normalizeRule(
      {
        ...rule,
        _rulebookId: undefined,
        categoryId: `${getCategoryId(rule)}_copy`,
        categoryLabel: `${String(rule.categoryLabel || "Category")} Copy`,
        ruleId: `${getRuleId(rule)}-copy`,
      },
      index
    );
    patchRules([...normalizedRules, copy]);
    selectRule(getRuleId(copy));
    toast.success("Category duplicated");
  };

  const deleteCategory = (ruleId: string) => {
    const nextRules = normalizedRules.filter(
      (rule) => getRuleId(rule) !== ruleId
    );
    patchRules(nextRules);
    selectRule(getRuleId(nextRules[0] || {}));
    toast.success("Category deleted");
  };

  const addKeyword = (
    rule: Record<string, unknown>,
    field: KeywordBucketField,
    keyword: string
  ) => {
    const nextRule = patchRuleKeywords({ field, keyword, mode: "add", rule });
    patchRules(
      normalizedRules.map((item) =>
        getRuleId(item) === getRuleId(rule) ? nextRule : item
      )
    );
    toast.success("Keyword added");
  };

  const removeKeyword = (
    rule: Record<string, unknown>,
    field: KeywordBucketField,
    keyword: string
  ) => {
    const nextRule = patchRuleKeywords({ field, keyword, mode: "remove", rule });
    patchRules(
      normalizedRules.map((item) =>
        getRuleId(item) === getRuleId(rule) ? nextRule : item
      )
    );
  };

  const handleSaveToRulebook = (rule: Record<string, unknown>) => {
    saveToRulebook(rule);
    toast.success(`"${String(rule.categoryLabel || rule.categoryId)}" saved to rulebook`);
  };

  const importRulebookRule = (entry: RulebookKeywordRule) => {
    const index = normalizedRules.length;
    const nextRule = normalizeRule(
      {
        _rulebookId: entry.id,
        categoryId: entry.categoryId,
        categoryLabel: entry.categoryLabel,
        confidence: entry.confidence,
        containsKeywords: entry.containsKeywords,
        description: entry.description,
        exactKeywords: entry.exactKeywords,
        excludeKeywords: entry.excludeKeywords,
        priority: entry.priority,
        ruleVersion: entry.ruleVersion,
        scope: entry.scope,
      },
      index
    );
    patchRules([...normalizedRules, nextRule]);
    selectRule(getRuleId(nextRule));
    setShowRulebookBrowser(false);
    toast.success(`"${entry.name}" added from rulebook`);
  };

  // ── Compact mode (showCategoryList = false) ───────────────────────────────

  if (!showCategoryList) {
    const rule = normalizedRules.find((r) => getRuleId(r) === selectedRuleId);
    if (!rule) return null;
    const ruleIndex = normalizedRules.findIndex(
      (r) => getRuleId(r) === selectedRuleId
    );
    return (
      <CategoryEditor
        disabled={disabled}
        onAddKeyword={(field, keyword) => addKeyword(rule, field, keyword)}
        onDelete={() => deleteCategory(getRuleId(rule))}
        onDuplicate={() => duplicateCategory(rule, normalizedRules.length)}
        onRemoveKeyword={(field, keyword) => removeKeyword(rule, field, keyword)}
        onSaveToRulebook={() => handleSaveToRulebook(rule)}
        onUpdate={(patch) => updateRule(getRuleId(rule), patch, ruleIndex)}
        rule={rule}
        source={(rule._rulebookId ? "rulebook" : "local") as "local" | "rulebook"}
      />
    );
  }

  // ── Three-panel layout ────────────────────────────────────────────────────

  return (
    <div className="overflow-hidden rounded-md border">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b bg-muted/20 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Keyword Rulebook</span>
          <span className="rounded-full border bg-background/70 px-2 py-0.5 text-[10px] uppercase">
            {normalizedRules.length} categories
          </span>
        </div>
        <p className="hidden text-muted-foreground text-xs sm:block">
          Keyword Mapper consumes this rulebook; final rollups live in
          Aggregation Rulebook.
        </p>
      </div>

      {/* Panels */}
      <div className="flex h-[520px]">
        {/* Left panel: category navigator */}
        <div className="flex w-52 shrink-0 flex-col border-r">
          <div className="flex items-center justify-between border-b px-2 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Categories
            </span>
            {!disabled && (
              <Button
                className="h-6 gap-0.5 px-1.5 text-[11px]"
                onClick={addCategory}
                size="sm"
                type="button"
                variant="ghost"
              >
                <Plus className="size-3" />
                New
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-1">
            {/* Local rules */}
            {localRules.length > 0 && (
              <>
                <div className="px-2 pb-0.5 pt-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Local
                </div>
                {localRules.map((rule) => (
                  <CategoryListItem
                    key={getRuleId(rule)}
                    onClick={() => selectRule(getRuleId(rule))}
                    rule={rule}
                    selected={selectedRuleId === getRuleId(rule)}
                    source="local"
                  />
                ))}
              </>
            )}

            {/* Rulebook rules */}
            {rulebookRules.length > 0 && (
              <>
                <div className="flex items-center gap-1 px-2 pb-0.5 pt-3 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  <BookMarked className="size-2.5" />
                  Rulebook
                </div>
                {rulebookRules.map((rule) => (
                  <CategoryListItem
                    key={getRuleId(rule)}
                    onClick={() => selectRule(getRuleId(rule))}
                    rule={rule}
                    selected={selectedRuleId === getRuleId(rule)}
                    source="rulebook"
                  />
                ))}
              </>
            )}

            {normalizedRules.length === 0 && (
              <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                No categories yet.
                <br />
                Click &ldquo;+ New&rdquo; to add one.
              </div>
            )}
          </div>

          {/* Browse rulebook */}
          <div className="border-t p-2">
            <Button
              className="h-7 w-full text-xs"
              onClick={() => setShowRulebookBrowser(true)}
              size="sm"
              type="button"
              variant="outline"
            >
              <BookOpen className="mr-1.5 size-3" />
              Browse Rulebook
            </Button>
          </div>
        </div>

        {/* Middle panel: editor */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          {selectedRule ? (
            <CategoryEditor
              disabled={disabled}
              onAddKeyword={(field, keyword) =>
                addKeyword(selectedRule, field, keyword)
              }
              onDelete={() => deleteCategory(getRuleId(selectedRule))}
              onDuplicate={() =>
                duplicateCategory(selectedRule, normalizedRules.length)
              }
              onRemoveKeyword={(field, keyword) =>
                removeKeyword(selectedRule, field, keyword)
              }
              onSaveToRulebook={() => handleSaveToRulebook(selectedRule)}
              onUpdate={(patch) =>
                updateRule(
                  getRuleId(selectedRule),
                  patch,
                  normalizedRules.findIndex(
                    (r) => getRuleId(r) === getRuleId(selectedRule)
                  )
                )
              }
              rule={selectedRule}
              source={selectedRuleSource as "local" | "rulebook"}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Select a category to edit
            </div>
          )}
        </div>

        {/* Right panel: keyword summary */}
        <div className="w-48 shrink-0 overflow-y-auto border-l bg-muted/10">
          {selectedRule ? (
            <CategorySummaryPanel rule={selectedRule} />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
              Select a category to see its keyword summary
            </div>
          )}
        </div>
      </div>

      {showRulebookBrowser && (
        <RulebookBrowserDialog
          existingCategoryIds={normalizedRules.map((r) => getCategoryId(r))}
          onClose={() => setShowRulebookBrowser(false)}
          onImport={importRulebookRule}
        />
      )}
    </div>
  );
}
