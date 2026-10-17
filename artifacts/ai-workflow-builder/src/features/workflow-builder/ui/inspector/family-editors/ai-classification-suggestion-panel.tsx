// Config panel for the "AI Mapping Suggestion" block. Generates category
// suggestions (via POST /api/ai-classification-suggestion) for rows a connected
// Keyword Mapper could not confidently classify, using an editable system prompt.
// Mirrors the pin-then-replay pattern HttpJsonSourcePanel/CurrencyRateSourcePanel
// use: a generation is pinned into config.proposal, and the block's pure executor
// only ever replays it — it never calls a model itself. Suggestions are never
// authoritative until a reviewer explicitly accepts them here.

import { useState } from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { apiFetch } from "@/platform/auth/api-fetch";
import { type WorkflowBlock } from "@/shared/workflow-engine/workflow/contracts";
import type { WorkflowEdge, WorkflowNode } from "@/shared/workflow-engine/state/workflow-store";
import type { LocalRunRecord } from "@/shared/workflow-engine/workflow/contracts";
import { getLatestOutputValueForRole } from "../block-inspector";

type AiClassificationSuggestionPanelProps = {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  edges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  onConfigPatch: (patch: Record<string, unknown>) => void;
};

type Suggestion = {
  rowRef: string;
  suggestedCategoryId: string | null;
  confidence: number;
  rationale: string;
  matchedSignal: string;
};

type GenerateResult = {
  ok: boolean;
  results?: Suggestion[];
  model?: string;
  generatedAt?: string;
  error?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function collectRows(value: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(value)) {
    return value.filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null);
  }
  const record = asRecord(value);
  for (const key of ["unmatchedRows", "lowConfidenceRows", "mappedRows", "rows"]) {
    if (Array.isArray(record[key])) return collectRows(record[key]);
  }
  return [];
}

function collectRulebook(value: unknown) {
  const rules = asRecord(value).keywordRules;
  if (!Array.isArray(rules)) return [];
  return rules
    .map((rule) => {
      const record = asRecord(rule);
      return {
        categoryId: stringValue(record.categoryId || record.category),
        categoryLabel: stringValue(record.categoryLabel || record.categoryId || record.category),
        keywords: Array.isArray(record.keywords) ? record.keywords.map(String) : [],
      };
    })
    .filter((rule) => rule.categoryId);
}

/** Finds this block's `roleId` input edge and resolves the connected upstream
 * block's latest output for it — same lookup LastRunSection's "Inputs consumed"
 * list already does. Falls back to the source block's own config (so a Keyword
 * Rulebook's rules are available even if it was never explicitly run). */
function findConnectedValue({
  block,
  edges,
  lastRun,
  nodes,
  roleId,
}: {
  block: WorkflowBlock;
  edges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  roleId: string;
}) {
  const edge = edges.find(
    (e) => e.target === block.id && e.data?.workflowEdge?.targetInputRole === roleId
  );
  if (!edge) return undefined;
  const sourceBlock = nodes.find((n) => n.id === edge.source)?.data.block;
  if (!sourceBlock) return undefined;
  const sourceOutputRole = edge.data?.workflowEdge?.sourceOutputRole || "output";
  return getLatestOutputValueForRole({ block: sourceBlock, lastRun, roleId: sourceOutputRole });
}

function confidenceTone(confidence: number, threshold: number) {
  if (confidence >= threshold) {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
  }
  return "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400";
}

export function AiClassificationSuggestionPanel({
  block,
  config,
  disabled,
  edges,
  lastRun,
  nodes,
  onConfigPatch,
}: AiClassificationSuggestionPanelProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const threshold = Number(config.confidenceThreshold) || 0.7;
  const proposal = asRecord(config.proposal);
  const pinnedSuggestions = Array.isArray(proposal.suggestions)
    ? (proposal.suggestions as Suggestion[])
    : [];
  const accepted = config.proposalAccepted === true;

  // Two separate roles, not one generic "rows" — see run.ts's note: the engine
  // routes a connected block's data by the UPSTREAM's own output role name
  // (unmatched_rows / low_confidence_rows), not by a generic target role name.
  const connectedUnmatchedValue = findConnectedValue({
    block,
    edges,
    lastRun,
    nodes,
    roleId: "unmatched_rows",
  });
  const connectedLowConfidenceValue = findConnectedValue({
    block,
    edges,
    lastRun,
    nodes,
    roleId: "low_confidence_rows",
  });
  const connectedRulesValue = findConnectedValue({
    block,
    edges,
    lastRun,
    nodes,
    roleId: "keyword_rules",
  });
  const rows = [...collectRows(connectedUnmatchedValue), ...collectRows(connectedLowConfidenceValue)];
  const rulebook = collectRulebook(connectedRulesValue);
  const rowsConnected = edges.some(
    (e) =>
      e.target === block.id &&
      (e.data?.workflowEdge?.targetInputRole === "unmatched_rows" ||
        e.data?.workflowEdge?.targetInputRole === "low_confidence_rows")
  );

  const generate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await apiFetch("/api/ai-classification-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: stringValue(config.systemPrompt),
          model: stringValue(config.model),
          rows: rows.map((row, index) => ({
            rowId: stringValue(row.rowId || row.id, `row-${index + 1}`),
            account: stringValue(row.account),
            label: stringValue(row.label),
            description: stringValue(row.description),
            amount: typeof row.amount === "number" ? row.amount : undefined,
            currency: stringValue(row.currency),
          })),
          keywordRules: rulebook,
        }),
      });
      const data = (await response.json()) as GenerateResult;
      if (!response.ok || !data.ok) {
        setError(data.error || "The request failed.");
        return;
      }
      onConfigPatch({
        proposal: {
          suggestions: data.results ?? [],
          model: data.model,
          generatedAt: data.generatedAt,
        },
        proposalAccepted: false,
        proposalAcceptedAt: null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The request could not be sent.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground text-sm">AI Mapping Suggestion</h3>
        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
          Connect a Keyword Mapper's Unmatched or Low-confidence output to Rows, and
          optionally the Keyword Rulebook for reference. Suggestions are proposals
          only — nothing downstream treats them as authoritative until you accept
          them below.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">System prompt</Label>
        <Textarea
          className="min-h-40 font-mono text-xs"
          disabled={disabled}
          onChange={(event) => onConfigPatch({ systemPrompt: event.target.value })}
          value={stringValue(config.systemPrompt)}
        />
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs">Model</Label>
          <Input
            className="font-mono text-xs"
            disabled={disabled}
            onChange={(event) => onConfigPatch({ model: event.target.value })}
            placeholder="anthropic/claude-sonnet-5"
            value={stringValue(config.model)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs">Confidence threshold</Label>
          <Input
            disabled={disabled}
            inputMode="decimal"
            onChange={(event) => {
              const next = Number(event.target.value);
              onConfigPatch({ confidenceThreshold: Number.isFinite(next) ? next : 0.7 });
            }}
            value={String(threshold)}
          />
        </div>
      </div>

      <div className="rounded-md bg-muted/40 p-3 text-muted-foreground text-xs">
        {rowsConnected ? (
          <div>
            {rows.length} row(s) available from the connected input
            {rows.length === 0 ? " — run the Keyword Mapper first so it has unmatched/low-confidence rows to share." : "."}
          </div>
        ) : (
          <div className="text-amber-700 dark:text-amber-400">
            Rows input not connected — connect a Keyword Mapper's Unmatched or
            Low-confidence output before generating.
          </div>
        )}
        {rulebook.length > 0 ? (
          <div className="mt-1">{rulebook.length} rulebook categor{rulebook.length === 1 ? "y" : "ies"} given as reference.</div>
        ) : null}
      </div>

      <Button
        disabled={disabled || generating || rows.length === 0}
        onClick={generate}
        size="sm"
        type="button"
      >
        {generating ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
        {generating ? "Generating…" : pinnedSuggestions.length > 0 ? "Regenerate suggestions" : "Generate suggestions"}
      </Button>

      {error ? (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-2 text-xs">{error}</div>
      ) : null}

      {pinnedSuggestions.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-foreground text-xs font-medium">
              {pinnedSuggestions.length} suggestion(s) — {stringValue(proposal.model)}
            </div>
            <div
              className={`rounded-full border px-2 py-0.5 text-[11px] ${accepted ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}
            >
              {accepted ? "Accepted — authoritative" : "Pending review"}
            </div>
          </div>
          <div className="max-h-80 space-y-1.5 overflow-y-auto">
            {pinnedSuggestions.map((suggestion) => (
              <div className="rounded-md border bg-background/60 p-2 text-xs" key={suggestion.rowRef}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{suggestion.rowRef}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">
                      {suggestion.suggestedCategoryId ?? "no match"}
                    </span>
                    <span
                      className={`rounded-full border px-1.5 py-0.5 text-[10px] tabular-nums ${confidenceTone(suggestion.confidence, threshold)}`}
                    >
                      {suggestion.confidence.toFixed(2)}
                    </span>
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground leading-relaxed">{suggestion.rationale}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              disabled={disabled || accepted}
              onClick={() =>
                onConfigPatch({ proposalAccepted: true, proposalAcceptedAt: new Date().toISOString() })
              }
              size="sm"
              type="button"
              variant="secondary"
            >
              <Check className="size-3.5" /> Accept
            </Button>
            <Button
              disabled={disabled || !accepted}
              onClick={() => onConfigPatch({ proposalAccepted: false, proposalAcceptedAt: null })}
              size="sm"
              type="button"
              variant="outline"
            >
              <X className="size-3.5" /> Revoke
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
