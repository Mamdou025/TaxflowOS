"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, FlaskConical, Layers, Plus, Tag, Trash2, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TwoPanelToolShell } from "@/components/workflow/two-panel-tool-shell";

// ─── Types ────────────────────────────────────────────────────────────────────

type RollupOperation =
  | "sum"
  | "sum_abs"
  | "subtract"
  | "multiply"
  | "divide"
  | "pass_through";

type RollupGroup = {
  rollupId: string;
  label: string;
  description?: string;
  // Each entry is either a raw upstream category ID or another group's rollupId
  includeCategoryIds: string[];
  operation: RollupOperation;
};

type TestResult = {
  groupId: string;
  label: string;
  result: number;
  breakdown: Array<{ id: string; label: string; value: number; isGroup: boolean }>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function humanize(id: string) {
  return id
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function isGroupRef(id: string, groups: RollupGroup[]): boolean {
  return groups.some((g) => g.rollupId === id);
}

// Returns all rollupIds that groupId transitively depends on
function getDependencies(groupId: string, groups: RollupGroup[]): Set<string> {
  const result = new Set<string>();
  const visit = (id: string) => {
    const g = groups.find((g) => g.rollupId === id);
    if (!g) return;
    for (const child of g.includeCategoryIds) {
      if (isGroupRef(child, groups) && !result.has(child)) {
        result.add(child);
        visit(child);
      }
    }
  };
  visit(groupId);
  return result;
}

// Returns groups that can safely be added as children of groupId (no cycles)
function getAvailableGroups(groupId: string, groups: RollupGroup[]): RollupGroup[] {
  return groups.filter((g) => {
    if (g.rollupId === groupId) return false;
    // Would create a cycle if g already (transitively) depends on groupId
    const gDeps = getDependencies(g.rollupId, groups);
    return !gDeps.has(groupId);
  });
}

// All leaf category IDs across the whole rulebook (non-group-ref entries)
function getAllLeafCategories(groups: RollupGroup[]): string[] {
  const all = new Set<string>();
  for (const g of groups) {
    for (const id of g.includeCategoryIds) {
      if (!isGroupRef(id, groups)) all.add(id);
    }
  }
  return [...all].sort();
}

function computeRecursive(
  id: string,
  groups: RollupGroup[],
  leafValues: Record<string, number>,
  visited: Set<string>
): number {
  if (visited.has(id)) return 0; // cycle guard
  const group = groups.find((g) => g.rollupId === id);
  if (!group) return leafValues[id] ?? 0;

  const next = new Set([...visited, id]);
  const nums = group.includeCategoryIds.map((child) =>
    computeRecursive(child, groups, leafValues, next)
  );
  if (nums.length === 0) return 0;
  switch (group.operation) {
    case "sum": return nums.reduce((a, b) => a + b, 0);
    case "sum_abs": return nums.reduce((a, b) => a + Math.abs(b), 0);
    case "subtract": return nums[0] - nums.slice(1).reduce((a, b) => a + b, 0);
    case "multiply": return nums.reduce((a, b) => a * b, 1);
    case "divide": return nums.slice(1).reduce((a, b) => a / b, nums[0]);
    case "pass_through": return nums[0] ?? 0;
    default: return nums.reduce((a, b) => a + b, 0);
  }
}

export function getRollupGroups(config: Record<string, unknown>): RollupGroup[] {
  for (const key of ["rollupRules", "rollup_rules", "rules"]) {
    const value = config[key];
    if (!Array.isArray(value)) continue;
    return value
      .filter((item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null
      )
      .map((item, i) => {
        const rollupId = String(item.rollupId || item.nodeId || `group_${i + 1}`);
        const cats = Array.isArray(item.includeCategoryIds)
          ? item.includeCategoryIds.map(String).filter(Boolean)
          : typeof item.includeCategoryIds === "string"
            ? item.includeCategoryIds.split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];
        return {
          rollupId,
          label: String(item.label || humanize(rollupId)),
          description: String(item.description || ""),
          includeCategoryIds: cats,
          operation: (item.operation as RollupOperation) || "sum",
        };
      });
  }
  return [];
}

const OPERATIONS: Array<{ label: string; value: RollupOperation }> = [
  { label: "Sum", value: "sum" },
  { label: "Sum (absolute values)", value: "sum_abs" },
  { label: "Subtract", value: "subtract" },
  { label: "Multiply", value: "multiply" },
  { label: "Divide", value: "divide" },
  { label: "Pass through (first)", value: "pass_through" },
];

// ─── Tree child: raw category leaf OR nested group ref ────────────────────────

function GroupTreeChild({
  depth,
  groups,
  id,
  onSelect,
  selectedId,
}: {
  depth: number;
  groups: RollupGroup[];
  id: string;
  onSelect: (rollupId: string) => void;
  selectedId: string | null;
}) {
  const [expanded, setExpanded] = useState(true);
  const referencedGroup = groups.find((g) => g.rollupId === id);
  const indent = 24 + depth * 14;

  if (referencedGroup) {
    const hasChildren = referencedGroup.includeCategoryIds.length > 0;
    return (
      <div>
        <div
          className={cn(
            "flex items-center gap-1 py-1 pr-2 transition-colors cursor-pointer",
            selectedId === referencedGroup.rollupId
              ? "bg-violet-50 dark:bg-violet-950/40"
              : "hover:bg-muted/30"
          )}
          style={{ paddingLeft: indent }}
        >
          <button
            className="shrink-0"
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            type="button"
          >
            {hasChildren ? (
              <ChevronDown
                className={cn(
                  "size-3 text-violet-400 transition-transform",
                  !expanded && "-rotate-90"
                )}
              />
            ) : (
              <span className="size-3" />
            )}
          </button>
          <Layers className="size-2.5 shrink-0 text-violet-500 dark:text-violet-400" />
          <button
            className="min-w-0 flex-1 text-left"
            onClick={() => onSelect(referencedGroup.rollupId)}
            type="button"
          >
            <span className="truncate text-[10px] font-medium text-violet-700 dark:text-violet-300">
              {referencedGroup.label}
            </span>
            <span className="ml-1.5 font-mono text-[9px] text-muted-foreground">
              {referencedGroup.rollupId}
            </span>
          </button>
        </div>
        {expanded && hasChildren && referencedGroup.includeCategoryIds.map((childId) => (
          <GroupTreeChild
            depth={depth + 1}
            groups={groups}
            id={childId}
            key={childId}
            onSelect={onSelect}
            selectedId={selectedId}
          />
        ))}
      </div>
    );
  }

  // Raw category leaf
  return (
    <div
      className="flex items-center gap-1.5 py-1 pr-2"
      style={{ paddingLeft: indent }}
    >
      <Tag className="size-2.5 shrink-0 text-muted-foreground/50" />
      <span className="truncate font-mono text-[10px] text-muted-foreground">{id}</span>
    </div>
  );
}

// ─── Left panel: group tree ───────────────────────────────────────────────────

function GroupTreeItem({
  disabled,
  group,
  groups,
  isSelected,
  onDelete,
  onSelect,
}: {
  disabled: boolean;
  group: RollupGroup;
  groups: RollupGroup[];
  isSelected: boolean;
  onDelete: () => void;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = group.includeCategoryIds.length > 0;
  const groupRefCount = group.includeCategoryIds.filter((id) => isGroupRef(id, groups)).length;
  const leafCount = group.includeCategoryIds.length - groupRefCount;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 border-b px-2 py-1.5 transition-colors",
          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted/40"
        )}
      >
        <button
          className="shrink-0"
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
          type="button"
        >
          {hasChildren ? (
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground transition-transform",
                !expanded && "-rotate-90"
              )}
            />
          ) : (
            <span className="size-3.5" />
          )}
        </button>

        <button
          className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left"
          onClick={onSelect}
          type="button"
        >
          <span className="truncate text-xs font-medium leading-none">{group.label}</span>
          <span className="truncate font-mono text-[10px] text-muted-foreground leading-none">
            {group.rollupId}
          </span>
        </button>

        {/* Child counts */}
        <div className="flex shrink-0 items-center gap-0.5">
          {groupRefCount > 0 && (
            <span className="rounded bg-violet-100 px-1 py-0.5 text-[9px] text-violet-600 tabular-nums dark:bg-violet-950 dark:text-violet-400">
              {groupRefCount}G
            </span>
          )}
          {leafCount > 0 && (
            <span className="rounded bg-muted/50 px-1 py-0.5 text-[9px] text-muted-foreground tabular-nums">
              {leafCount}C
            </span>
          )}
        </div>

        {!disabled && (
          <button
            className="invisible shrink-0 rounded p-0.5 text-muted-foreground/50 transition-colors hover:text-destructive group-hover:visible"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            title="Delete group"
            type="button"
          >
            <Trash2 className="size-3" />
          </button>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="border-b bg-muted/10">
          {group.includeCategoryIds.map((id) => (
            <GroupTreeChild
              depth={0}
              groups={groups}
              id={id}
              key={id}
              onSelect={onSelect}
              selectedId={isSelected ? group.rollupId : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Right panel: Edit tab ────────────────────────────────────────────────────

function EditTab({
  availableCategories,
  disabled,
  groups,
  onSave,
  selectedGroup,
}: {
  availableCategories?: { id: string; label: string }[];
  disabled: boolean;
  groups: RollupGroup[];
  onSave: (updated: RollupGroup) => void;
  selectedGroup: RollupGroup | null;
}) {
  const [catInput, setCatInput] = useState("");

  if (!selectedGroup) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="select-none font-light font-mono text-3xl text-muted-foreground/30">∑</div>
        <p className="max-w-40 text-muted-foreground text-xs">
          Select a group on the left or create a new one to edit it.
        </p>
      </div>
    );
  }

  const update = (patch: Partial<RollupGroup>) =>
    onSave({ ...selectedGroup, ...patch });

  const addRawCategories = () => {
    const ids = catInput.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) return;
    const next = [...new Set([...selectedGroup.includeCategoryIds, ...ids])];
    update({ includeCategoryIds: next });
    setCatInput("");
  };

  const removeItem = (id: string) =>
    update({ includeCategoryIds: selectedGroup.includeCategoryIds.filter((x) => x !== id) });

  const toggleGroupRef = (rollupId: string) => {
    const already = selectedGroup.includeCategoryIds.includes(rollupId);
    const next = already
      ? selectedGroup.includeCategoryIds.filter((x) => x !== rollupId)
      : [...new Set([...selectedGroup.includeCategoryIds, rollupId])];
    update({ includeCategoryIds: next });
  };

  const otherIds = new Set(
    groups.filter((g) => g.rollupId !== selectedGroup.rollupId).map((g) => g.rollupId)
  );
  const idConflict = otherIds.has(selectedGroup.rollupId);
  const availableGroups = getAvailableGroups(selectedGroup.rollupId, groups);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-4">
      {/* Identity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[11px]">Group ID</Label>
          <Input
            className={cn("h-7 font-mono text-xs", idConflict && "border-destructive")}
            disabled={disabled}
            onChange={(e) => update({ rollupId: e.target.value })}
            placeholder="e.g. income_base"
            value={selectedGroup.rollupId}
          />
          {idConflict && (
            <p className="text-[10px] text-destructive">ID already used by another group</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px]">Label</Label>
          <Input
            className="h-7 text-xs"
            disabled={disabled}
            onChange={(e) => update({ label: e.target.value })}
            placeholder="e.g. Income Base"
            value={selectedGroup.label}
          />
        </div>
      </div>

      {/* Operation */}
      <div className="space-y-1.5">
        <Label className="text-[11px]">Operation</Label>
        <Select
          disabled={disabled}
          onValueChange={(v) => update({ operation: v as RollupOperation })}
          value={selectedGroup.operation}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OPERATIONS.map((op) => (
              <SelectItem className="text-xs" key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Current members — mixed chips */}
      {selectedGroup.includeCategoryIds.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-[11px]">
            Members
            <span className="ml-1 text-muted-foreground">
              ({selectedGroup.includeCategoryIds.length})
            </span>
          </Label>
          <div className="flex flex-wrap gap-1 rounded-md border bg-muted/20 p-2">
            {selectedGroup.includeCategoryIds.map((id) => {
              const isRef = isGroupRef(id, groups);
              const refGroup = groups.find((g) => g.rollupId === id);
              return (
                <span
                  key={id}
                  className={cn(
                    "flex items-center gap-1 rounded border pl-1.5 pr-1 py-0.5 font-mono text-[10px]",
                    isRef
                      ? "border-violet-400/40 bg-violet-400/10 text-violet-700 dark:text-violet-300"
                      : "border-sky-400/40 bg-sky-400/10 text-sky-700 dark:text-sky-300"
                  )}
                >
                  {isRef ? (
                    <Layers className="size-2.5 shrink-0" />
                  ) : (
                    <Tag className="size-2.5 shrink-0" />
                  )}
                  {isRef && refGroup ? refGroup.label : id}
                  {!disabled && (
                    <button
                      className="rounded p-0.5 opacity-60 hover:text-destructive hover:opacity-100"
                      onClick={() => removeItem(id)}
                      title={`Remove ${id}`}
                      type="button"
                    >
                      <X className="size-2.5" />
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Add sub-groups (violet) */}
      {!disabled && availableGroups.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-[11px]">
            Include a group
            <span className="ml-1 text-muted-foreground text-[10px] normal-case font-normal">
              — click to toggle
            </span>
          </Label>
          <div className="flex flex-wrap gap-1">
            {availableGroups.map((g) => {
              const included = selectedGroup.includeCategoryIds.includes(g.rollupId);
              return (
                <button
                  key={g.rollupId}
                  className={cn(
                    "flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] transition-colors",
                    included
                      ? "border-violet-400/50 bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/40"
                  )}
                  onClick={() => toggleGroupRef(g.rollupId)}
                  type="button"
                >
                  <Layers className="size-2.5" />
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add categories — clickable upstream pills or fallback text input */}
      {!disabled && (
        <div className="space-y-1.5">
          <Label className="text-[11px]">Add categories</Label>

          {availableCategories && availableCategories.length > 0 ? (
            /* Upstream categories from connected Keyword Mapper / Rulebook */
            <div className="flex flex-wrap gap-1 rounded-md border bg-muted/20 p-2">
              {availableCategories.map((cat) => {
                const included = selectedGroup.includeCategoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    className={cn(
                      "flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] transition-colors",
                      included
                        ? "border-sky-400/50 bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                        : "border-border bg-background text-muted-foreground hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-950/40"
                    )}
                    onClick={() => {
                      const next = included
                        ? selectedGroup.includeCategoryIds.filter((x) => x !== cat.id)
                        : [...new Set([...selectedGroup.includeCategoryIds, cat.id])];
                      update({ includeCategoryIds: next });
                    }}
                    title={cat.id}
                    type="button"
                  >
                    <Tag className="size-2.5 shrink-0" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          ) : availableCategories ? (
            /* mapper is connected but has no categories defined yet */
            <div className="rounded-md border border-dashed bg-muted/10 px-3 py-3 text-center text-[11px] text-muted-foreground">
              Your connected Keyword Mapper has no categories defined yet. Add categories there first, then return here to build groups.
            </div>
          ) : (
            /* No upstream context — fallback text input */
            <div className="flex gap-1.5">
              <Input
                className="h-7 flex-1 font-mono text-xs"
                onChange={(e) => setCatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRawCategories()}
                placeholder="category_id, another_id …"
                value={catInput}
              />
              <Button
                className="h-7 px-3 text-xs"
                disabled={!catInput.trim()}
                onClick={addRawCategories}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="size-3" />
                Add
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div className="space-y-1.5">
        <Label className="text-[11px]">Description (optional)</Label>
        <textarea
          className="min-h-[60px] w-full resize-none rounded-md border bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          disabled={disabled}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            update({ description: e.target.value })
          }
          placeholder="What does this group represent?"
          value={selectedGroup.description ?? ""}
        />
      </div>
    </div>
  );
}

// ─── Right panel: Test tab ────────────────────────────────────────────────────

function TestTab({ groups }: { groups: RollupGroup[] }) {
  const leafCategories = useMemo(() => getAllLeafCategories(groups), [groups]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<TestResult[] | null>(null);

  const runTest = () => {
    const parsed: Record<string, number> = {};
    for (const [id, raw] of Object.entries(values)) {
      const n = Number.parseFloat(raw);
      parsed[id] = Number.isFinite(n) ? n : 0;
    }
    setResults(
      groups.map((group) => {
        const result = computeRecursive(group.rollupId, groups, parsed, new Set());
        const breakdown = group.includeCategoryIds.map((id) => {
          const refGroup = groups.find((g) => g.rollupId === id);
          return {
            id,
            label: refGroup ? refGroup.label : id,
            value: computeRecursive(id, groups, parsed, new Set()),
            isGroup: !!refGroup,
          };
        });
        return { groupId: group.rollupId, label: group.label, result, breakdown };
      })
    );
  };

  if (leafCategories.length === 0 && groups.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-xs text-muted-foreground">
        Add categories to groups first, then test here.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-4">
      {leafCategories.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Leaf category values
          </div>
          <div className="divide-y rounded-md border">
            {leafCategories.map((catId) => (
              <div className="flex items-center gap-2 px-3 py-1.5" key={catId}>
                <Tag className="size-3 shrink-0 text-muted-foreground/50" />
                <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
                  {catId}
                </span>
                <Input
                  className="h-6 w-28 text-right font-mono text-xs"
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [catId]: e.target.value }))
                  }
                  placeholder="0"
                  type="number"
                  value={values[catId] ?? ""}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        className="w-full gap-2"
        onClick={runTest}
        size="sm"
        type="button"
        variant="outline"
      >
        <FlaskConical className="size-3.5" />
        Run Test
      </Button>

      {results && (
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Results
          </div>
          {results.map((r) => (
            <div className="rounded-md border bg-muted/10" key={r.groupId}>
              <div className="flex items-center justify-between border-b px-3 py-2">
                <div>
                  <span className="font-medium text-xs">{r.label}</span>
                  <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                    {r.groupId}
                  </span>
                </div>
                <span className="font-mono font-semibold text-sm tabular-nums">
                  {r.result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </span>
              </div>
              <div className="divide-y px-3">
                {r.breakdown.map(({ id, label, value, isGroup }) => (
                  <div className="flex items-center gap-2 py-1 text-[11px]" key={id}>
                    {isGroup ? (
                      <Layers className="size-3 shrink-0 text-violet-400" />
                    ) : (
                      <Tag className="size-3 shrink-0 text-muted-foreground/40" />
                    )}
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate font-mono",
                        isGroup ? "text-violet-700 dark:text-violet-300" : "text-muted-foreground"
                      )}
                    >
                      {label}
                    </span>
                    <span className="tabular-nums">
                      {value.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Right panel: Summary tab ─────────────────────────────────────────────────

function SummaryTab({ groups }: { groups: RollupGroup[] }) {
  if (groups.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-xs text-muted-foreground">
        No groups defined yet.
      </div>
    );
  }

  const leafCategories = getAllLeafCategories(groups);
  const groupRefCount = groups.reduce(
    (acc, g) => acc + g.includeCategoryIds.filter((id) => isGroupRef(id, groups)).length,
    0
  );

  return (
    <div className="flex flex-col gap-3 overflow-y-auto p-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Groups", value: groups.length },
          { label: "Leaf categories", value: leafCategories.length },
          { label: "Group refs", value: groupRefCount },
        ].map(({ label, value }) => (
          <div className="rounded-md border bg-muted/10 p-3 text-center" key={label}>
            <div className="font-semibold text-lg tabular-nums">{value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>

      {groups.map((group) => {
        const refs = group.includeCategoryIds.filter((id) => isGroupRef(id, groups));
        const leaves = group.includeCategoryIds.filter((id) => !isGroupRef(id, groups));
        return (
          <div className="rounded-md border" key={group.rollupId}>
            <div className="flex items-center justify-between border-b bg-muted/10 px-3 py-2">
              <div>
                <span className="font-medium text-xs">{group.label}</span>
                <code className="ml-2 text-[10px] text-muted-foreground">{group.rollupId}</code>
              </div>
              <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[9px] uppercase text-muted-foreground">
                {group.operation}
              </span>
            </div>
            {group.description && (
              <p className="border-b px-3 py-1.5 text-[11px] text-muted-foreground">
                {group.description}
              </p>
            )}
            <div className="flex flex-wrap gap-1 p-3">
              {refs.map((id) => {
                const refGroup = groups.find((g) => g.rollupId === id);
                return (
                  <span
                    className="flex items-center gap-1 rounded border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5 font-mono text-[10px] text-violet-700 dark:text-violet-300"
                    key={id}
                  >
                    <Layers className="size-2.5" />
                    {refGroup?.label ?? id}
                  </span>
                );
              })}
              {leaves.map((id) => (
                <span
                  className="rounded border border-sky-400/30 bg-sky-400/10 px-1.5 py-0.5 font-mono text-[10px] text-sky-700 dark:text-sky-300"
                  key={id}
                >
                  {id}
                </span>
              ))}
              {group.includeCategoryIds.length === 0 && (
                <span className="text-[11px] text-muted-foreground italic">Empty group</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── RollupRulebookEditor ─────────────────────────────────────────────────────

export function RollupRulebookEditor({
  availableCategories,
  config,
  disabled = false,
  fill,
  onConfigPatch,
}: {
  availableCategories?: { id: string; label: string }[];
  config: Record<string, unknown>;
  disabled?: boolean;
  fill?: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
}) {
  const groups = useMemo(() => getRollupGroups(config), [config]);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => groups[0]?.rollupId ?? null
  );
  const [activeTab, setActiveTab] = useState<"edit" | "test" | "summary">("edit");

  const saveGroups = useCallback(
    (next: RollupGroup[]) => {
      const key =
        "rollupRules" in config
          ? "rollupRules"
          : "rollup_rules" in config
            ? "rollup_rules"
            : "rollupRules";
      onConfigPatch({ [key]: next });
    },
    [config, onConfigPatch]
  );

  const selectedGroup = groups.find((g) => g.rollupId === selectedId) ?? null;

  const addGroup = useCallback(() => {
    if (disabled) return;
    const id = `group_${groups.length + 1}`;
    const newGroup: RollupGroup = {
      rollupId: id,
      label: humanize(id),
      description: "",
      includeCategoryIds: [],
      operation: "sum",
    };
    saveGroups([...groups, newGroup]);
    setSelectedId(id);
    setActiveTab("edit");
  }, [disabled, groups, saveGroups]);

  const deleteGroup = useCallback(
    (rollupId: string) => {
      if (disabled) return;
      // Also remove this group from any other group's includeCategoryIds
      const next = groups
        .filter((g) => g.rollupId !== rollupId)
        .map((g) => ({
          ...g,
          includeCategoryIds: g.includeCategoryIds.filter((id) => id !== rollupId),
        }));
      saveGroups(next);
      if (selectedId === rollupId) setSelectedId(next[0]?.rollupId ?? null);
    },
    [disabled, groups, saveGroups, selectedId]
  );

  const updateGroup = useCallback(
    (updated: RollupGroup) => {
      if (disabled) return;
      const oldId = selectedId;
      const next = groups.map((g) => (g.rollupId === oldId ? updated : g));
      // If rollupId changed, update any references to the old ID in other groups
      if (updated.rollupId !== oldId && oldId) {
        for (const g of next) {
          if (g.rollupId === updated.rollupId) continue;
          g.includeCategoryIds = g.includeCategoryIds.map((id) =>
            id === oldId ? updated.rollupId : id
          );
        }
      }
      saveGroups(next);
      if (updated.rollupId !== selectedId) setSelectedId(updated.rollupId);
    },
    [disabled, groups, saveGroups, selectedId]
  );

  // ─── Left panel ──────────────────────────────────────────────────────────────

  const leftPanel = (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Groups
        </span>
        <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[9px] tabular-nums text-muted-foreground">
          {groups.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {groups.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="select-none font-light font-mono text-2xl text-muted-foreground/30">∑</span>
            <p className="text-[11px] text-muted-foreground">No groups yet</p>
          </div>
        ) : (
          groups.map((group) => (
            <GroupTreeItem
              disabled={disabled}
              group={group}
              groups={groups}
              isSelected={selectedId === group.rollupId}
              key={group.rollupId}
              onDelete={() => deleteGroup(group.rollupId)}
              onSelect={() => {
                setSelectedId(group.rollupId);
                setActiveTab("edit");
              }}
            />
          ))
        )}
      </div>

      {!disabled && (
        <div className="shrink-0 border-t p-2">
          <Button
            className="w-full gap-1.5 text-xs"
            onClick={addGroup}
            size="sm"
            type="button"
            variant="outline"
          >
            <Plus className="size-3.5" />
            New Group
          </Button>
        </div>
      )}
    </div>
  );

  // ─── Right panel ─────────────────────────────────────────────────────────────

  const rightPanel = (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b">
        {(["edit", "test", "summary"] as const).map((tab) => (
          <button
            className={cn(
              "px-4 py-2 text-xs transition-colors",
              activeTab === tab
                ? "border-b-2 border-primary font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {activeTab === "edit" && (
          <EditTab
            availableCategories={availableCategories}
            disabled={disabled}
            groups={groups}
            onSave={updateGroup}
            selectedGroup={selectedGroup}
          />
        )}
        {activeTab === "test" && <TestTab groups={groups} />}
        {activeTab === "summary" && <SummaryTab groups={groups} />}
      </div>
    </div>
  );

  return (
    <TwoPanelToolShell
      badge="Rollup Rules"
      badgeVariant="review"
      defaultLeftPercent={32}
      leftPanel={leftPanel}
      rightPanel={rightPanel}
      title="Rollup Rulebook"
    />
  );
}
