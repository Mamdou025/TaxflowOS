

import { FileSpreadsheet, FileUp, LockKeyhole, Rows3 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
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
import {
  buildExcelSourceConfigPatch,
  detectExcelColumnMapping,
  type ExcelColumnMapping,
  formatFileSize,
  getExcelColumnMappingFromConfig,
  getExcelSheet,
  getExcelTableSelection,
  getExcelWorkbookFromConfig,
  hasExcelSourceEvidence,
  parseExcelWorkbookFile,
} from "@/shared/workflow-engine/parsing/excel-utils";

type ExcelUploadPanelProps = {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
  onCreateSourceVersion: () => void;
  sourceLocked: boolean;
  sourceUsedInRun: boolean;
  sourceVersion: number;
};

const MAPPING_FIELDS: Array<{
  key: keyof ExcelColumnMapping;
  label: string;
}> = [
  { key: "account", label: "Account" },
  { key: "label", label: "Label" },
  { key: "description", label: "Description" },
  { key: "amount", label: "Amount" },
  { key: "debit", label: "Debit" },
  { key: "credit", label: "Credit" },
  { key: "currency", label: "Currency" },
];

const NONE_VALUE = "__none__";

function LockedSourceCallout({
  onCreateSourceVersion,
  sourceUsedInRun,
  sourceVersion,
}: {
  onCreateSourceVersion: () => void;
  sourceUsedInRun: boolean;
  sourceVersion: number;
}) {
  return (
    <div className="space-y-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
      <div className="flex items-center gap-2 font-medium">
        <LockKeyhole className="size-3.5" />
        Source evidence is locked
      </div>
      <p className="text-muted-foreground">
        {sourceUsedInRun
          ? "This workbook has run history. Create a new Source version before replacing the workbook or changing selected evidence."
          : "Published Source data should be changed through a new draft version."}
      </p>
      <Button onClick={onCreateSourceVersion} size="sm" type="button">
        Create new source version from v{sourceVersion}
      </Button>
    </div>
  );
}

function MetadataGrid({
  config,
  sheetCount,
}: {
  config: Record<string, unknown>;
  sheetCount: number;
}) {
  const rows: [string, unknown][] = [
    ["File", config.fileName || config.workbookName || "No workbook uploaded"],
    ["Size", formatFileSize(config.fileSize)],
    ["Uploaded", config.uploadTimestamp || "not uploaded"],
    ["Workbook ID", config.workbookId || "not assigned"],
    ["Sheets", sheetCount],
    ["Selected sheet", config.selectedSheet || "none"],
    ["Selected range", config.selectedRange || "none"],
    ["Header row", config.headerRowNumber || "auto"],
    ["First data row", config.firstDataRowNumber || "auto"],
    ["Rows exposed", config.selectedRowsCount ?? 0],
    ["Columns", Array.isArray(config.columns) ? config.columns.join(", ") : ""],
    ["Status", config.sourceStatus || "draft"],
  ];

  return (
    <div className="divide-y rounded-md border bg-background/60 text-xs">
      {rows.map(([label, value]) => (
        <div
          className="grid grid-cols-[8rem_1fr] gap-2 px-2 py-1.5"
          key={String(label)}
        >
          <span className="text-muted-foreground">{label}</span>
          <span className="break-words font-medium">{String(value || "")}</span>
        </div>
      ))}
    </div>
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: The panel coordinates upload, locking, sheet selection, and row normalization controls.
export function ExcelUploadPanel({
  config,
  disabled,
  onConfigPatch,
  onCreateSourceVersion,
  sourceLocked,
  sourceUsedInRun,
  sourceVersion,
}: ExcelUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const hasCapturedEvidence = hasExcelSourceEvidence(config);
  const workbook = getExcelWorkbookFromConfig(config);
  const selectedSheet = getExcelSheet(
    workbook,
    String(config.selectedSheet || "")
  );
  const tableSelection = selectedSheet
    ? getExcelTableSelection(selectedSheet, {
        firstDataRowNumber:
          typeof config.firstDataRowNumber === "number"
            ? config.firstDataRowNumber
            : undefined,
        headerRowNumber:
          typeof config.headerRowNumber === "number"
            ? config.headerRowNumber
            : undefined,
      })
    : null;
  const columnMapping = selectedSheet
    ? getExcelColumnMappingFromConfig(
        config,
        tableSelection?.headers || selectedSheet.headers
      )
    : {};

  const patchWorkbook = async (file: File) => {
    setIsParsing(true);
    try {
      const parsedWorkbook = await parseExcelWorkbookFile(file);
      const patch = buildExcelSourceConfigPatch({
        existingConfig: config,
        workbook: parsedWorkbook,
      });
      onConfigPatch(
        hasCapturedEvidence
          ? patch
          : {
              ...patch,
              sourceUsedInRun: false,
              sourceVersionCreatedAt: new Date().toISOString(),
            }
      );
      const firstSheet = parsedWorkbook.sheets[0];
      toast.success(
        `Loaded ${parsedWorkbook.fileName} with ${parsedWorkbook.sheets.length} sheet${parsedWorkbook.sheets.length === 1 ? "" : "s"}`
      );
      if (firstSheet?.truncated) {
        toast.warning(
          `Stored first ${firstSheet.persistedRowLimit} rows for local preview.`
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not parse workbook"
      );
    } finally {
      setIsParsing(false);
    }
  };

  const selectSheet = (sheetName: string) => {
    if (!workbook) {
      return;
    }
    const sheet = getExcelSheet(workbook, sheetName);
    const table = sheet ? getExcelTableSelection(sheet) : null;
    onConfigPatch(
      buildExcelSourceConfigPatch({
        existingConfig: config,
        mapping: table ? detectExcelColumnMapping(table.headers) : undefined,
        selectedSheetName: sheetName,
        workbook,
      })
    );
  };

  const updateMapping = (
    field: keyof ExcelColumnMapping,
    selectedColumn: string
  ) => {
    if (!(workbook && selectedSheet)) {
      return;
    }
    const nextMapping = {
      ...columnMapping,
      [field]: selectedColumn === NONE_VALUE ? undefined : selectedColumn,
    };
    onConfigPatch(
      buildExcelSourceConfigPatch({
        existingConfig: config,
        mapping: nextMapping,
        selectedRange: String(
          config.selectedRange ||
            tableSelection?.inferredRange ||
            selectedSheet.inferredRange
        ),
        selectedSheetName: selectedSheet.sheetName,
        workbook,
      })
    );
  };

  const updateRange = (selectedRange: string) => {
    if (!(workbook && selectedSheet)) {
      return;
    }
    onConfigPatch(
      buildExcelSourceConfigPatch({
        existingConfig: config,
        mapping: columnMapping,
        selectedRange:
          selectedRange.trim() ||
          tableSelection?.inferredRange ||
          selectedSheet.inferredRange,
        selectedSheetName: selectedSheet.sheetName,
        workbook,
      })
    );
  };

  const updateTableSelection = (patch: {
    firstDataRowNumber?: number;
    headerRowNumber?: number;
    includeRowsWithoutAmount?: boolean;
    includeTotalRows?: boolean;
  }) => {
    if (!(workbook && selectedSheet)) {
      return;
    }
    const nextTable = getExcelTableSelection(selectedSheet, {
      firstDataRowNumber: patch.firstDataRowNumber,
      headerRowNumber: patch.headerRowNumber,
    });
    const nextMapping =
      patch.headerRowNumber === undefined
        ? columnMapping
        : detectExcelColumnMapping(nextTable.headers);
    onConfigPatch(
      buildExcelSourceConfigPatch({
        existingConfig: config,
        firstDataRowNumber: patch.firstDataRowNumber,
        headerRowNumber: patch.headerRowNumber,
        includeRowsWithoutAmount: patch.includeRowsWithoutAmount,
        includeTotalRows: patch.includeTotalRows,
        mapping: nextMapping,
        selectedSheetName: selectedSheet.sheetName,
        workbook,
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-md border bg-muted/20 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-medium text-sm">
              <FileSpreadsheet className="size-4" />
              Excel workbook source
            </div>
            <p className="mt-1 text-muted-foreground text-xs">
              Upload a local .xlsx workbook, choose the sheet/range, and expose
              normalized rows as immutable Source evidence.
            </p>
          </div>
          <span className="rounded-full border bg-background/70 px-2 py-0.5 text-[10px] uppercase">
            v{sourceVersion}
          </span>
        </div>

        <MetadataGrid
          config={config}
          sheetCount={workbook?.sheets.length || 0}
        />

        {sourceLocked ? (
          <LockedSourceCallout
            onCreateSourceVersion={onCreateSourceVersion}
            sourceUsedInRun={sourceUsedInRun}
            sourceVersion={sourceVersion}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={disabled || isParsing}
              onClick={() => inputRef.current?.click()}
              size="sm"
              type="button"
              variant="secondary"
            >
              <FileUp className="mr-2 size-3.5" />
              {workbook ? "Upload / replace draft workbook" : "Upload Excel"}
            </Button>
            <input
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              className="hidden"
              disabled={disabled || isParsing}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  patchWorkbook(file);
                }
                event.target.value = "";
              }}
              ref={inputRef}
              type="file"
            />
            <Button
              disabled={disabled || !workbook || !selectedSheet}
              onClick={() =>
                selectedSheet &&
                updateRange(
                  tableSelection?.inferredRange || selectedSheet.inferredRange
                )
              }
              size="sm"
              type="button"
              variant="outline"
            >
              <Rows3 className="mr-2 size-3.5" />
              Use selected sheet as rows
            </Button>
          </div>
        )}
      </div>

      {workbook && selectedSheet && (
        <div className="space-y-3 rounded-md border bg-muted/20 p-3">
          <div>
            <div className="font-medium text-sm">Sheet and column mapping</div>
            <p className="mt-1 text-muted-foreground text-xs">
              Adjust detected columns when the workbook headers are custom.
              Ambiguous sheets fall back to nearby label/amount and debit/credit
              extraction.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="ml-1">Selected sheet</Label>
              <Select
                disabled={disabled || sourceLocked}
                onValueChange={selectSheet}
                value={selectedSheet.sheetName}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sheet" />
                </SelectTrigger>
                <SelectContent>
                  {workbook.sheets.map((sheet) => (
                    <SelectItem key={sheet.sheetName} value={sheet.sheetName}>
                      {sheet.sheetName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="ml-1">Selected range</Label>
              <Input
                disabled={disabled || sourceLocked}
                onBlur={(event) => updateRange(event.target.value)}
                onChange={(event) =>
                  onConfigPatch({ selectedRange: event.target.value })
                }
                value={String(
                  config.selectedRange ||
                    tableSelection?.inferredRange ||
                    selectedSheet.inferredRange
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="ml-1">Header row</Label>
              <Input
                disabled={disabled || sourceLocked}
                min={1}
                onBlur={(event) => {
                  const headerRowNumber = Number(event.target.value);
                  if (Number.isFinite(headerRowNumber)) {
                    updateTableSelection({
                      firstDataRowNumber: headerRowNumber + 1,
                      headerRowNumber,
                    });
                  }
                }}
                onChange={(event) =>
                  onConfigPatch({
                    headerRowNumber: Number(event.target.value) || 1,
                  })
                }
                type="number"
                value={String(
                  config.headerRowNumber ||
                    tableSelection?.headerRowNumber ||
                    selectedSheet.detectedHeaderRowNumber ||
                    1
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="ml-1">First data row</Label>
              <Input
                disabled={disabled || sourceLocked}
                min={2}
                onBlur={(event) => {
                  const firstDataRowNumber = Number(event.target.value);
                  if (Number.isFinite(firstDataRowNumber)) {
                    updateTableSelection({ firstDataRowNumber });
                  }
                }}
                onChange={(event) =>
                  onConfigPatch({
                    firstDataRowNumber: Number(event.target.value) || 2,
                  })
                }
                type="number"
                value={String(
                  config.firstDataRowNumber ||
                    tableSelection?.firstDataRowNumber ||
                    selectedSheet.detectedFirstDataRowNumber ||
                    2
                )}
              />
            </div>
            <div className="flex items-center gap-2 rounded-md border bg-background/60 px-3 py-2 text-xs">
              <Checkbox
                checked={config.includeTotalRows === true}
                disabled={disabled || sourceLocked}
                id="excel-include-total-rows"
                onCheckedChange={(checked) =>
                  updateTableSelection({ includeTotalRows: checked === true })
                }
              />
              <Label htmlFor="excel-include-total-rows">
                Include total/subtotal rows
              </Label>
            </div>
            <div className="flex items-center gap-2 rounded-md border bg-background/60 px-3 py-2 text-xs">
              <Checkbox
                checked={config.includeRowsWithoutAmount === true}
                disabled={disabled || sourceLocked}
                id="excel-include-blank-amount-rows"
                onCheckedChange={(checked) =>
                  updateTableSelection({
                    includeRowsWithoutAmount: checked === true,
                  })
                }
              />
              <Label htmlFor="excel-include-blank-amount-rows">
                Include rows without an amount
              </Label>
            </div>
            {MAPPING_FIELDS.map((field) => (
              <div className="space-y-2" key={field.key}>
                <Label className="ml-1">{field.label} column</Label>
                <Select
                  disabled={disabled || sourceLocked}
                  onValueChange={(value) => updateMapping(field.key, value)}
                  value={columnMapping[field.key] || NONE_VALUE}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE}>Not mapped</SelectItem>
                    {(tableSelection?.headers || selectedSheet.headers).map(
                      (header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
