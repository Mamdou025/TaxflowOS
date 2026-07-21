"use client";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";
import { formatFileSize } from "./excel-utils";

type SourcePanelProps = {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
  sourceVersion: number;
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

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      {children}
    </div>
  );
}

export function CurrencyRateSourcePanel({
  config,
  disabled,
  onConfigPatch,
  sourceVersion,
}: SourcePanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground text-sm">
          Bank of Canada FX Rate
        </h3>
        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
          This is the external rate evidence. Changes to the rate should be made
          downstream in FX Rate Review, then locked as a Protected FX Rate.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Document currency">
          <Input
            disabled={disabled}
            onChange={(event) =>
              onConfigPatch({ documentCurrency: event.target.value })
            }
            value={stringValue(config.documentCurrency, "USD")}
          />
        </Field>
        <Field label="Reporting currency">
          <Input
            disabled={disabled}
            onChange={(event) =>
              onConfigPatch({ reportingCurrency: event.target.value })
            }
            value={stringValue(config.reportingCurrency, "CAD")}
          />
        </Field>
        <Field label="Year">
          <Input
            disabled={disabled}
            onChange={(event) =>
              onConfigPatch({ fapiYear: patchNumber(event.target.value) })
            }
            value={numberValue(config.fapiYear)}
          />
        </Field>
        <Field label="Local draft override">
          <Input
            disabled={disabled}
            onChange={(event) =>
              onConfigPatch({ overrideRate: patchNumber(event.target.value) })
            }
            value={numberValue(config.overrideRate)}
          />
        </Field>
      </div>

      <div className="rounded-md bg-muted/40 p-3 text-muted-foreground text-xs">
        <div>Provider: Bank of Canada Valet API</div>
        <div>Rate type: annual average</div>
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
