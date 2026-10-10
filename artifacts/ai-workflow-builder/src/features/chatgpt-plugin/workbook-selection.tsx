import { useEffect, useState } from 'react';
import type { SourceInspection, WorkbookSelection } from './source-upload';

const fields = [
  'account',
  'label',
  'description',
  'amount',
  'debit',
  'credit',
  'currency',
  'accountType',
];
export function WorkbookSelectionForm({
  inspection,
  disabled,
  onHeader,
  onSelect,
}: {
  inspection: SourceInspection;
  disabled: boolean;
  onHeader: (sheetName: string, headerRowNumber: number) => Promise<void>;
  onSelect: (selection: WorkbookSelection | null) => void;
}) {
  const [sheetName, setSheetName] = useState('');
  const [header, setHeader] = useState(1);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [currency, setCurrency] = useState('');
  const sheet = inspection.sheets.find((item) => item.sheetName === sheetName);
  const needsCurrency = !!(mapping.amount || mapping.debit || mapping.credit) && !mapping.currency;
  const valid =
    !!sheet &&
    header === sheet.detectedHeaderRowNumber &&
    !!(mapping.account || mapping.label || mapping.description) &&
    (!needsCurrency || /^[A-Z]{3}$/.test(currency));
  useEffect(() => {
    onSelect(
      valid
        ? { sheetName, headerRowNumber: header, mapping, ...(needsCurrency ? { currency } : {}) }
        : null,
    );
  }, [valid, sheetName, header, mapping, currency, needsCurrency, onSelect]);
  return (
    <fieldset disabled={disabled} className="viewer-panel">
      <legend>Choose spreadsheet data</legend>
      <label className="viewer-field">
        Worksheet
        <select
          aria-label="Source worksheet"
          value={sheetName}
          onChange={(event) => {
            const name = event.target.value;
            setSheetName(name);
            setMapping({});
            setCurrency('');
            setHeader(
              inspection.sheets.find((item) => item.sheetName === name)?.detectedHeaderRowNumber ??
                1,
            );
          }}
        >
          <option value="">Choose a worksheet</option>
          {inspection.sheets.map((item) => (
            <option key={item.sheetName} value={item.sheetName}>
              {item.sheetName}
            </option>
          ))}
        </select>
      </label>
      {sheet && (
        <>
          <label className="viewer-field">
            Header row
            <input
              aria-label="Source header row"
              type="number"
              min={1}
              step={1}
              value={header}
              onChange={(event) => {
                setHeader(Number(event.target.value));
                setMapping({});
              }}
            />
          </label>
          {header !== sheet.detectedHeaderRowNumber && (
            <button
              className="viewer-button"
              type="button"
              disabled={!Number.isInteger(header) || header < 1}
              onClick={() => void onHeader(sheetName, header)}
            >
              Read selected header
            </button>
          )}
          <div className="viewer-field-grid">
            {fields.map((field) => (
              <label className="viewer-field" key={field}>
                {field}
                <select
                  aria-label={`Map ${field} column`}
                  value={mapping[field] ?? ''}
                  onChange={(event) =>
                    setMapping((previous) => ({ ...previous, [field]: event.target.value }))
                  }
                >
                  <option value="">Not mapped</option>
                  {sheet.headers.map((name, index) => (
                    <option key={`${index}:${name}`} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          {needsCurrency && (
            <label className="viewer-field">
              Source currency
              <input
                aria-label="Source currency"
                maxLength={3}
                placeholder="EUR"
                value={currency}
                onChange={(event) => setCurrency(event.target.value.toUpperCase())}
              />
            </label>
          )}
          <div className="viewer-table-scroll">
            <table>
              <thead>
                <tr>
                  {sheet.headers.map((name, index) => (
                    <th key={`${index}:${name}`}>{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheet.previewRows.slice(1, 6).map((row, index) => (
                  <tr key={index}>
                    {row.map((value, column) => (
                      <td key={column}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="viewer-muted">
            Preview below the selected header. The server validates the complete selected data
            before it can be applied.
          </p>
          {!valid && (
            <p role="status">
              Select a worksheet and an account, label or description column. For amounts without a
              currency column, supply the source currency.
            </p>
          )}
        </>
      )}
    </fieldset>
  );
}
