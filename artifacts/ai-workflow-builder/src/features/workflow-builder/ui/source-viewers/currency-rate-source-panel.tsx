

// Setup panels for the two rate/assumption sources.
//
// CurrencyRateSourcePanel was previously a static four-field form: currencies were
// free text, nothing was ever fetched, and the only number that reached the engine
// was a hand-typed "local draft override". It described a Bank of Canada lookup
// without performing one.
//
// It now drives the real thing:
//   • the currency menu is loaded from GET /api/fx-currencies, which reads the
//     Valet FX_RATES_DAILY group — the picker offers exactly the series BoC
//     publishes, so it cannot drift into offering a pair that 404s;
//   • Fetch calls GET /api/fx-rate, which averages the year's daily observations
//     server-side, and the panel shows the real result *with its inputs* — series
//     name, observation count, window, min/max — so a reviewer can see what the
//     annual average rests on;
//   • the fetched rate is pinned into config as `liveRate`, which is what the
//     currency-rate block replays. The override stays available and, when set,
//     is shown as taking precedence — an override that silently wins is exactly
//     the kind of thing this panel exists to make visible.

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
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
import { formatFileSize } from "@/shared/workflow-engine/parsing/excel-utils";
import { useParamOptions } from "@/features/workflow-builder/ui/source-viewers/use-param-options";

type SourcePanelProps = {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
  sourceLocked?: boolean;
  sourceVersion: number;
};

type FxRateResult = {
  ok: boolean;
  reason?: string;
  rate?: number;
  seriesName?: string;
  rateType?: string;
  rateSource?: string;
  rateYear?: number;
  endpoint?: string;
  observationCount?: number;
  firstObservation?: string;
  lastObservation?: string;
  minRate?: number;
  maxRate?: number;
};

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function numberValue(value: unknown) {
  return typeof value === "number" ? String(value) : "";
}

function patchNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** A rate is not money — show it at the precision it was published with. */
function formatRate(rate?: number) {
  return typeof rate === "number"
    ? rate.toLocaleString("en-CA", {
        maximumFractionDigits: 6,
        minimumFractionDigits: 4,
      })
    : "—";
}

function Field({
  children,
  hint,
  label,
}: {
  children: React.ReactNode;
  hint?: string;
  label: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      {children}
      {hint ? (
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground tabular-nums">{value}</span>
    </div>
  );
}

export function CurrencyRateSourcePanel({
  config,
  disabled,
  onConfigPatch,
  sourceLocked,
  sourceVersion,
}: SourcePanelProps) {
  const readOnly = Boolean(disabled) || Boolean(sourceLocked);
  // The same declared source the API block's currency parameter uses — one
  // published list, one transport, no second opinion about which pairs exist.
  const { failed, options: currencies } = useParamOptions(
    "boc.fx_observations",
    "currency"
  );
  const documentCurrency = stringValue(config.documentCurrency, "USD");
  const reportingCurrency = stringValue(config.reportingCurrency, "CAD");
  const year =
    typeof config.fapiYear === "number"
      ? config.fapiYear
      : new Date().getFullYear() - 1;

  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState<FxRateResult | null>(null);

  const overrideRate =
    typeof config.overrideRate === "number" ? config.overrideRate : undefined;
  const liveRate =
    typeof config.liveRate === "number" ? config.liveRate : undefined;

  const fetchRate = async () => {
    setFetching(true);
    setResult(null);
    try {
      const response = await fetch(
        `/api/fx-rate?from=${encodeURIComponent(documentCurrency)}&to=${encodeURIComponent(
          reportingCurrency
        )}&year=${year}`
      );
      const data = (await response.json()) as FxRateResult;
      setResult(data);
      if (data.ok && typeof data.rate === "number") {
        onConfigPatch({
          liveRate: data.rate,
          rateProvider: data.rateSource ?? "bank_of_canada",
          rateType: data.rateType ?? "annual_average",
          sourceLocator: data.endpoint ?? config.sourceLocator,
        });
      }
    } catch (error) {
      setResult({
        ok: false,
        reason:
          error instanceof Error ? error.message : "The rate lookup failed.",
      });
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground text-sm">
          Bank of Canada FX Rate
        </h3>
        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
          The annual average of the published daily rate, read live from the Valet
          API. Fetch pins the rate into this block so the run replays it; a
          reviewed correction belongs downstream in FX Rate Review, then locked as
          a Protected FX Rate.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Document currency">
          {currencies === null ? (
            <div className="flex h-9 items-center gap-2 rounded-md border px-3 text-muted-foreground text-xs">
              <Loader2 className="size-3.5 animate-spin" /> Loading…
            </div>
          ) : currencies.length > 0 ? (
            <Select
              disabled={readOnly}
              onValueChange={(next) =>
                onConfigPatch({ documentCurrency: next })
              }
              value={documentCurrency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              disabled={readOnly}
              onChange={(event) =>
                onConfigPatch({
                  documentCurrency: event.target.value.toUpperCase(),
                })
              }
              value={documentCurrency}
            />
          )}
        </Field>
        <Field
          hint="The Valet series is quoted against CAD."
          label="Reporting currency"
        >
          <Input
            disabled={readOnly}
            onChange={(event) =>
              onConfigPatch({
                reportingCurrency: event.target.value.toUpperCase(),
              })
            }
            value={reportingCurrency}
          />
        </Field>
        <Field label="Year">
          <Input
            disabled={readOnly}
            inputMode="numeric"
            onChange={(event) =>
              onConfigPatch({ fapiYear: patchNumber(event.target.value) })
            }
            value={String(year)}
          />
        </Field>
      </div>

      {failed ? (
        <p className="text-[11px] text-amber-700 leading-relaxed dark:text-amber-400">
          The published currency list could not be loaded, so this is free text —
          enter a three-letter code. Fetch will report if the pair has no series.
        </p>
      ) : null}

      <div className="flex items-center gap-2">
        <Button
          disabled={readOnly || fetching || !documentCurrency}
          onClick={fetchRate}
          size="sm"
        >
          {fetching ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          {fetching
            ? "Fetching…"
            : `Fetch ${documentCurrency}/${reportingCurrency} ${year}`}
        </Button>
        {liveRate !== undefined && !result ? (
          <span className="text-muted-foreground text-xs">
            Pinned rate {formatRate(liveRate)}
          </span>
        ) : null}
      </div>

      {result ? (
        <div
          className={`rounded-md border p-3 text-xs ${
            result.ok
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-red-500/40 bg-red-500/10"
          }`}
        >
          {result.ok ? (
            <>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-medium text-foreground">
                  {documentCurrency}/{reportingCurrency} {result.rateYear}
                </span>
                <span className="font-semibold text-base text-foreground tabular-nums">
                  {formatRate(result.rate)}
                </span>
              </div>
              <div className="space-y-1">
                <MetaRow label="Series" value={result.seriesName ?? "—"} />
                <MetaRow
                  label="Observations averaged"
                  value={result.observationCount ?? "—"}
                />
                <MetaRow
                  label="Window"
                  value={
                    result.firstObservation && result.lastObservation
                      ? `${result.firstObservation} → ${result.lastObservation}`
                      : "—"
                  }
                />
                <MetaRow
                  label="Daily range"
                  value={
                    result.minRate !== undefined && result.maxRate !== undefined
                      ? `${formatRate(result.minRate)} – ${formatRate(result.maxRate)}`
                      : "—"
                  }
                />
              </div>
              {result.endpoint ? (
                <p className="mt-2 break-all font-mono text-[10.5px] text-muted-foreground">
                  {result.endpoint}
                </p>
              ) : null}
            </>
          ) : (
            <p className="leading-relaxed text-foreground">{result.reason}</p>
          )}
        </div>
      ) : null}

      <Field
        hint="Overrides the fetched rate for this workflow. Leave blank to use the published average."
        label="Local draft override"
      >
        <Input
          disabled={readOnly}
          onChange={(event) =>
            onConfigPatch({ overrideRate: patchNumber(event.target.value) })
          }
          placeholder="none"
          value={numberValue(config.overrideRate)}
        />
      </Field>

      {overrideRate !== undefined && liveRate !== undefined ? (
        <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-amber-700 text-xs leading-relaxed dark:text-amber-400">
          The override ({formatRate(overrideRate)}) takes precedence — the run uses
          it, not the fetched {formatRate(liveRate)}. Clear it to fall back to the
          published rate.
        </div>
      ) : null}

      <div className="rounded-md bg-muted/40 p-3 text-muted-foreground text-xs">
        <div>Provider: Bank of Canada Valet API</div>
        <div>Rate type: {stringValue(config.rateType, "annual_average")}</div>
        <div>Source version: v{sourceVersion}</div>
        <div>Locator: {stringValue(config.sourceLocator, "not set")}</div>
      </div>
    </div>
  );
}

export function FapiInputsSourcePanel({
  config,
  disabled,
  onConfigPatch,
  sourceVersion,
}: SourcePanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground text-sm">FAPI Inputs</h3>
        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
          Workbook assumptions for the calculator. FX rate is handled by the
          separate Bank of Canada source, review, and protected rate path.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Inclusion rate">
          <Input
            disabled={disabled}
            onChange={(event) =>
              onConfigPatch({ inclusionRate: patchNumber(event.target.value) })
            }
            value={numberValue(config.inclusionRate)}
          />
        </Field>
        <Field label="RTF">
          <Input
            disabled={disabled}
            onChange={(event) =>
              onConfigPatch({ rtf: patchNumber(event.target.value) })
            }
            value={numberValue(config.rtf)}
          />
        </Field>
        <Field label="FAT paid">
          <Input
            disabled={disabled}
            onChange={(event) =>
              onConfigPatch({ fatPaid: patchNumber(event.target.value) })
            }
            value={numberValue(config.fatPaid)}
          />
        </Field>
        <Field label="FAPI year">
          <Input
            disabled={disabled}
            onChange={(event) =>
              onConfigPatch({ fapiYear: patchNumber(event.target.value) })
            }
            value={numberValue(config.fapiYear)}
          />
        </Field>
      </div>

      <div className="rounded-md bg-muted/40 p-3 text-muted-foreground text-xs">
        <div>
          Expected results:{" "}
          {
            Object.keys(
              typeof config.expectedResults === "object" &&
                config.expectedResults !== null
                ? config.expectedResults
                : {}
            ).length
          }
        </div>
        <div>
          Imported from:{" "}
          {stringValue(config.importedFromWorkbook, "not imported")}
        </div>
        <div>Source version: v{sourceVersion}</div>
        <div>Workbook file size: {formatFileSize(config.fileSize)}</div>
      </div>
    </div>
  );
}
