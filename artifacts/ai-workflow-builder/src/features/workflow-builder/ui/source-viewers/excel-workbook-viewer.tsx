

import { Table2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";
import {
  buildExcelSourceConfigPatch,
  type ExcelWorkbookSourceData,
  formatFileSize,
  getExcelSheet,
  getExcelWorkbookFromConfig,
} from "@/shared/workflow-engine/parsing/excel-utils";

function getColumnLetter(index: number) {
  let value = "";
  let current = index + 1;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    value = String.fromCharCode(65 + remainder) + value;
    current = Math.floor((current - remainder) / 26);
  }
  return value;
}

function EmptyWorkbookState() {
  return (
    <div className="rounded-md border bg-background/70 p-3 text-muted-foreground text-xs">
      Upload an Excel workbook in Properties to preview sheets and expose
      selected rows.
    </div>
  );
}

function SheetTabs({
  disabled,
  onSelectSheet,
  selectedSheet,
  workbook,
}: {
  disabled?: boolean;
  onSelectSheet?: (sheetName: string) => void;
  selectedSheet?: string;
  workbook: ExcelWorkbookSourceData;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b bg-muted/30 px-2 pt-2">
      {workbook.sheets.map((sheet) => (
        <Button
          className={cn(
            "h-8 shrink-0 rounded-b-none px-3 text-xs",
            selectedSheet === sheet.sheetName && "border-b-background"
          )}
          disabled={disabled}
          key={sheet.sheetName}
          onClick={() => onSelectSheet?.(sheet.sheetName)}
          size="sm"
          type="button"
          variant={selectedSheet === sheet.sheetName ? "secondary" : "ghost"}
        >
          {sheet.sheetName}
        </Button>
      ))}
    </div>
  );
}

export function ExcelWorkbookViewer({
  config,
  disabled,
  onConfigPatch,
}: {
  config: Record<string, unknown>;
  disabled?: boolean;
  onConfigPatch?: (patch: Record<string, unknown>) => void;
}) {
  const workbook = getExcelWorkbookFromConfig(config);
  const selectedSheetName = String(config.selectedSheet || "");
  const sheet = getExcelSheet(workbook, selectedSheetName);
  const selectedHeaderRowNumber = Number(
    config.headerRowNumber || sheet?.detectedHeaderRowNumber || 1
  );

  const selectSheet = (sheetName: string) => {
    if (!(workbook && onConfigPatch)) {
      return;
    }
    onConfigPatch(
      buildExcelSourceConfigPatch({
        existingConfig: config,
        selectedSheetName: sheetName,
        workbook,
      })
    );
  };

  return (
    <aside className="flex min-h-0 flex-col gap-3 overflow-hidden bg-muted/20 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Table2 className="size-4" />
            Workbook
          </div>
          <div className="text-muted-foreground text-xs">Excel Source</div>
        </div>
        {workbook && (
          <span className="rounded-full border bg-background/70 px-2 py-0.5 text-[10px] uppercase">
            {workbook.sheets.length} sheet
            {workbook.sheets.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {workbook && sheet ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-background/70">
          <div className="grid gap-1 border-b px-3 py-2 text-xs">
            <div className="truncate font-medium">{workbook.fileName}</div>
            <div className="text-muted-foreground">
              {formatFileSize(workbook.fileSize)} | {sheet.rowCount} rows |{" "}
              {sheet.columnCount} columns | {sheet.inferredRange} | header row{" "}
              {selectedHeaderRowNumber}
            </div>
          </div>
          <SheetTabs
            disabled={disabled}
            onSelectSheet={selectSheet}
            selectedSheet={sheet.sheetName}
            workbook={workbook}
          />
          <div className="min-h-0 flex-1 overflow-auto">
            <table className="min-w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 z-10 bg-background">
                <tr>
                  <th className="sticky left-0 z-20 w-12 border-r border-b bg-muted/60 px-2 py-1 text-center font-medium text-muted-foreground">
                    #
                  </th>
                  {Array.from({ length: sheet.columnCount }, (_, index) => (
                    <th
                      className="min-w-28 border-r border-b bg-muted/60 px-2 py-1 text-center font-medium text-muted-foreground"
                      key={getColumnLetter(index)}
                    >
                      {getColumnLetter(index)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheet.cells.map((row, rowIndex) => {
                  const rowNumber = rowIndex + 1;
                  const rowKey = `${sheet.sheetName}-${row.join("\u001f")}`;
                  return (
                    <tr
                      className={cn(
                        "border-b",
                        rowNumber === selectedHeaderRowNumber &&
                          "bg-muted/30 font-medium",
                        rowIndex > 0 && "hover:bg-muted/20"
                      )}
                      key={rowKey}
                    >
                      <td className="sticky left-0 z-10 border-r bg-background px-2 py-1 text-center text-muted-foreground">
                        {rowNumber}
                      </td>
                      {Array.from({ length: sheet.columnCount }, (_, index) => {
                        const columnId = getColumnLetter(index);
                        return (
                          <td
                            className="max-w-56 border-r px-2 py-1"
                            key={`${rowKey}-${columnId}`}
                            title={row[index] || ""}
                          >
                            <span className="block truncate">
                              {row[index] || ""}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {sheet.truncated && (
            <div className="border-t bg-amber-500/10 px-3 py-2 text-amber-800 text-xs dark:text-amber-200">
              Showing the first {sheet.persistedRowLimit} data rows for local
              preview.
            </div>
          )}
        </div>
      ) : (
        <EmptyWorkbookState />
      )}
    </aside>
  );
}
