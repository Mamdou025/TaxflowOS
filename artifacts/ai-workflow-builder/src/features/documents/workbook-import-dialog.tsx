import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';
import {
  detectExcelColumnMapping,
  getExcelTableSelection,
  type ExcelColumnMapping,
  type ExcelWorkbookSourceData,
} from '@/shared/workflow-engine/parsing/excel-utils';
import type {
  SelectWorkbook,
  WorkbookSelection,
} from '@/shared/workflow-engine/runtime/workflow-runs/parse-upload';

const fields: [keyof ExcelColumnMapping, string][] = [
  ['account', 'Account'],
  ['label', 'Label'],
  ['description', 'Description'],
  ['amount', 'Amount'],
  ['debit', 'Debit'],
  ['credit', 'Credit'],
  ['currency', 'Currency'],
];

export function WorkbookImportDialog({
  workbook,
  onSelect,
  onCancel,
}: {
  workbook: ExcelWorkbookSourceData;
  onSelect: (selection: WorkbookSelection) => void;
  onCancel: () => void;
}) {
  const [sheetName, setSheetName] = useState('');
  const [headerRow, setHeaderRow] = useState(1);
  const [mapping, setMapping] = useState<ExcelColumnMapping>({});
  const [currency, setCurrency] = useState('');
  const sheet = workbook.sheets.find((item) => item.sheetName === sheetName);
  const validHeader =
    !!sheet && Number.isInteger(headerRow) && headerRow >= 1 && headerRow < sheet.cells.length;
  const table =
    sheet && validHeader
      ? getExcelTableSelection(sheet, {
          headerRowNumber: headerRow,
          firstDataRowNumber: headerRow + 1,
        })
      : undefined;
  const changeSelection = (name: string, row?: number) => {
    const selected = workbook.sheets.find((item) => item.sheetName === name);
    const header = row ?? selected?.detectedHeaderRowNumber ?? 1;
    setSheetName(name);
    setCurrency('');
    setHeaderRow(header);
    setMapping(
      selected && Number.isInteger(header) && header > 0
        ? detectExcelColumnMapping(
            getExcelTableSelection(selected, {
              headerRowNumber: header,
              firstDataRowNumber: header + 1,
            }).headers,
          )
        : {},
    );
  };
  const hasIdentity = !!(mapping.label || mapping.description || mapping.account);
  const needsCurrency = !!(mapping.amount || mapping.debit || mapping.credit) && !mapping.currency;
  const tooLarge = !!sheet && (sheet.totalRowCount ?? sheet.rowCount) > 50001;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent
        className="max-h-[90vh] overflow-auto sm:max-w-3xl"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogTitle>Choose spreadsheet data</DialogTitle>
        <DialogDescription>
          Your Excel file has been read. Choose the tab containing the records you want to import,
          then review its columns and click Use selected data. Hidden and empty tabs are excluded.
          Your original file stays unchanged.
        </DialogDescription>
        <p className="break-all text-sm">{workbook.fileName}</p>
        <label className="grid gap-1 text-sm">
          Worksheet
          <select
            className="rounded border bg-background p-2"
            value={sheetName}
            onChange={(e) => changeSelection(e.target.value)}
          >
            <option value="">Choose a worksheet…</option>
            {workbook.sheets.map((item) => (
              <option key={item.sheetName} value={item.sheetName}>
                {item.sheetName}
              </option>
            ))}
          </select>
        </label>
        {!sheet && (
          <p role="status" className="text-sm">
            This workbook contains {workbook.sheets.length} visible tabs. Choose a data tab above
            rather than a cover or summary tab. Closing this window pauses the import and keeps your
            attachment for retry.
          </p>
        )}
        {sheet && (
          <>
            <label className="grid gap-1 text-sm">
              Header row
              <input
                type="number"
                min={1}
                max={sheet.cells.length - 1}
                className="rounded border bg-background p-2"
                value={headerRow}
                onChange={(e) => changeSelection(sheetName, Number(e.target.value))}
              />
            </label>
            <p className="text-sm">
              Preview shows the first five data rows. All rows from the selected sheet are read on
              import, up to 50,000.
            </p>
            {table && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {fields.map(([key, label]) => (
                    <label key={key} className="grid gap-1 text-sm">
                      {label} column
                      <select
                        className="min-w-0 rounded border bg-background p-2"
                        value={mapping[key] ?? ''}
                        onChange={(e) =>
                          setMapping((previous) => ({
                            ...previous,
                            [key]: e.target.value || undefined,
                          }))
                        }
                      >
                        <option value="">Not mapped</option>
                        {table.headers.map((header) => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <div className="max-h-48 overflow-auto rounded border">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr>
                        {table.headers.map((header) => (
                          <th className="whitespace-nowrap p-2" key={header}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.cells.slice(headerRow, headerRow + 5).map((row, index) => (
                        <tr key={index}>
                          {table.headers.map((header, col) => (
                            <td className="max-w-64 truncate border-t p-2" key={header}>
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {needsCurrency && (
              <label className="grid gap-1 text-sm">
                Source currency
                <input
                  className="rounded border bg-background p-2"
                  placeholder="Three-letter code, e.g. EUR"
                  maxLength={3}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                />
                <span>Enter the currency used by the selected amounts.</span>
              </label>
            )}
            {!hasIdentity && (
              <p role="status">
                Map an account, label, or description column to identify the records.
              </p>
            )}
            {!mapping.amount && !mapping.debit && !mapping.credit && (
              <p role="status">
                No amount column selected. These records cannot supply financial amounts until a
                numeric column is mapped.
              </p>
            )}
            {tooLarge && (
              <p role="alert">
                This sheet exceeds 50,000 rows. Use a smaller source; partial imports are not
                allowed.
              </p>
            )}
          </>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded border px-4 py-2" onClick={onCancel}>
            Cancel import
          </button>
          <button
            type="button"
            className="rounded bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
            disabled={
              !validHeader ||
              !hasIdentity ||
              tooLarge ||
              (needsCurrency && !/^[A-Z]{3}$/.test(currency))
            }
            onClick={() =>
              onSelect({
                sheetName,
                headerRowNumber: headerRow,
                mapping,
                currency: needsCurrency ? currency : undefined,
              })
            }
          >
            Use selected data
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** The caller retains the file until selection completes; cancellation never submits chat. */
export function useWorkbookImport() {
  const [workbook, setWorkbook] = useState<ExcelWorkbookSourceData | null>(null);
  const pending = useRef<{
    resolve: (selection: WorkbookSelection) => void;
    reject: (error: Error) => void;
  } | null>(null);
  useEffect(
    () => () => {
      pending.current?.reject(new Error('Spreadsheet import cancelled.'));
      pending.current = null;
    },
    [],
  );
  const selectWorkbook: SelectWorkbook = (data) =>
    new Promise((resolve, reject) => {
      pending.current?.reject(new Error('Another spreadsheet import was started.'));
      pending.current = { resolve, reject };
      setWorkbook(data);
    });
  const finish = (selection?: WorkbookSelection) => {
    if (selection) pending.current?.resolve(selection);
    else
      pending.current?.reject(
        new Error('Spreadsheet import cancelled. Your file and message have been kept for retry.'),
      );
    pending.current = null;
    setWorkbook(null);
  };
  return {
    selectWorkbook,
    importDialog: workbook ? (
      <WorkbookImportDialog
        key={workbook.workbookId}
        workbook={workbook}
        onSelect={finish}
        onCancel={() => finish()}
      />
    ) : null,
  };
}
