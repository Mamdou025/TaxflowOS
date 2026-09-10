import { DocumentReviewTable } from './document-review-table';
import { parseDocumentNumber } from './document-records';
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  createWorkflowBlockFromCatalog,
  type WorkflowDefinition,
} from "@/shared/workflow-engine/local-fiscal-workflow";
import {
  parseExcelWorkbookFile,
  buildExcelSourceConfigPatch,
} from "@/shared/workflow-engine/parsing/excel-utils";
import { ReadableData } from "@/features/workflow-builder/ui/workspace/readable-data";

export function WorkflowTestData({
  definition,
  onChange,
}: {
  definition: WorkflowDefinition;
  onChange: (definition: WorkflowDefinition) => void;
}) {
  const sources = definition.blocks.filter(
    (block) =>
      block.family === "Source" &&
      (block.catalogId === "source:excel-workbook" ||
        /excel|workbook|uploaded|manual_table/.test(
          String(block.config.sourceKind),
        )),
  );
  const [target, setTarget] = useState(sources[0]?.id ?? "new");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [numericFields, setNumericFields] = useState<string[]>([]);
  const [decimal, setDecimal] = useState('.');
  const [reviewed, setReviewed] = useState(false);
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [ocrAvailable, setOcrAvailable] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const parseText = (content: string, extension: string, signal: AbortSignal) => new Promise<Record<string, unknown>[]>((resolve, reject) => {
    const worker = new Worker(new URL('./document-worker.ts', import.meta.url), { type: 'module' });
    const finish = () => { worker.terminate(); signal.removeEventListener('abort', abort); };
    const abort = () => { finish(); reject(new Error('Upload cancelled.')); };
    signal.addEventListener('abort', abort, { once: true });
    worker.onmessage = event => { finish(); event.data.error ? reject(new Error(event.data.error)) : resolve(event.data.rows); };
    worker.onerror = () => { finish(); reject(new Error('Could not read this document.')); };
    worker.postMessage({ text: content, extension });
  });
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [manual, setManual] = useState(false);
  const [text, setText] = useState("");
  const [label, setLabel] = useState("Example record");
  const [amount, setAmount] = useState("");
  const [textField, setTextField] = useState("");
  const [numberField, setNumberField] = useState("");
  const apply = () => {
    if (!preview) return;
    if (!Array.isArray(preview.rows) || !preview.rows.length) { toast.error('Add at least one record.'); return; }
    const converted = preview.rows.map(row => ({ ...row }));
    for (const [index, row] of converted.entries()) {
      for (const key of new Set([...numericFields, ...(numberField ? [numberField] : [])])) {
        if (!(key in row)) continue;
        if (row[key] === '' || row[key] == null) { row[key] = null; continue; }
        const number = parseDocumentNumber(row[key], decimal);
        if (number === null) { toast.error(`Row ${index + 1}, ${key}: enter a valid number or choose the correct decimal separator.`); return; }
        row[key] = number;
      }
    }
    const existing = sources.find((source) => source.id === target);
    const block =
      existing ??
      createWorkflowBlockFromCatalog("source:excel-workbook", {
        id: crypto.randomUUID(),
        label: "Document",
        position: { x: 0, y: 0 },
      });
    const rows = Array.isArray(preview.rows)
      ? converted.map((row, index) => ({
          ...row,
          rowId: row.rowId ?? `row-${index + 1}`,
          ...(textField
            ? {
                label: String(row[textField] ?? ""),
                description: String(row[textField] ?? ""),
              }
            : {}),
          ...(numberField ? { amount: row[numberField] } : {}),
        }))
      : [];
    const updated = {
      ...block,
      config: {
        ...block.config,
        ...(preview.sourceKind === "manual_table"
          ? {
              excelWorkbook: undefined,
              workbookFile: undefined,
              workbookId: undefined,
              workbookName: undefined,
              selectedSheet: undefined,
              selectedRange: undefined,
              sheets: undefined,
              sourceLocator: `document://${block.id}`,
            }
          : {}),
        ...preview,
        uploadTimestamp: preview.uploadTimestamp,
        requireUpload: false,
        selectedRowsCount: rows.length,
        rows,
        manualRows: rows,
        tableRows: rows,
        sourceStatus: "draft",
        sourceUsedInRun: false,
        sourceVersion: Number(block.config.sourceVersion ?? 0) + 1,
      },
    };
    onChange({
      ...definition,
      blocks: existing
        ? definition.blocks.map((item) =>
            item.id === block.id ? updated : item,
          )
        : [...definition.blocks, updated],
    });
    setPreview(null);
    toast.success(
      existing
        ? "Test data updated"
        : "Document source added. Connect it to the next block in Build.",
    );
  };
  const upload = async (file: File, ocr = false) => {
    controller.current?.abort();
    const abort = new AbortController(); controller.current = abort;
    setProgress('Reading document...');
    setReviewed(false); setNumericFields([]); setScanFile(null);
    setBusy(true);
    setPreview(null);
    setTextField("");
    setNumberField("");
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error('Use a document smaller than 20 MB.');
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension === 'pdf' && !(await file.slice(0, 1024).text()).includes('%PDF-')) throw new Error('This file does not contain a valid PDF header. Choose a PDF document.');
      if (extension === "xlsx" || extension === "xls") {
        const workbook = await parseExcelWorkbookFile(file);
        const patch = buildExcelSourceConfigPatch({
          existingConfig: { includeRowsWithoutAmount: true },
          workbook,
        });
        if (Array.isArray(patch.rows))
          patch.rows = patch.rows.map((row) => ({
            ...(row.raw ?? {}),
            ...row,
          }));
        if (abort.signal.aborted) return;
        setPreview(patch);
        if (Array.isArray(patch.rows)) setNumericFields([...new Set(patch.rows.flatMap(Object.keys))].filter(key => patch.rows.some((row: Record<string, unknown>) => typeof row[key] === 'number')));
      } else {
        let rows: Record<string, unknown>[];
        if (extension === "csv" || extension === "tsv") {
          rows = await parseText(await file.text(), extension, abort.signal);
        } else if (extension === "json") {
          const value = JSON.parse(await file.text());
          if (value == null) throw new Error('Use an object or a list of records.');
          rows = Array.isArray(value)
            ? value
            : Array.isArray(value.rows)
              ? value.rows
              : [value];
          if (
            !rows.every(
              (row) => row && typeof row === "object" && !Array.isArray(row),
            )
          )
            throw new Error("Use an object or a list of records.");
        } else {
          let content: string;
          if (extension === 'pdf' || extension === 'docx') {
            setProgress(ocr ? 'Reading scanned pages with OCR. Review every extracted number.' : 'Extracting document text on the server...');
            const body = new FormData(); body.append('file', file); if (ocr) body.append('ocr', 'true');
            const response = await fetch('/api/workflow-extract', { method: 'POST', body, signal: AbortSignal.any([abort.signal, AbortSignal.timeout(120000)]) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Document extraction failed.');
            if (result.needsOcr) { setScanFile(file); setOcrAvailable(result.ocrAvailable); return; }
            content = result.text;
          } else content = await file.text();
          setProgress('Finding records and numeric fields...');
          rows = await parseText(content, 'txt', abort.signal);
        }
        if (!rows.length)
          throw new Error(
            "No readable records found. For scanned documents, enter the extracted values manually.",
          );
        if (abort.signal.aborted) return;
        const extracted = ['pdf', 'docx', 'txt'].includes(extension ?? '');
        setNumericFields([...new Set(rows.flatMap(Object.keys))].filter(key => extracted ? key.startsWith('number_') : rows.some(row => typeof row[key] === 'number') && rows.every(row => row[key] == null || typeof row[key] === 'number')));
        setText(JSON.stringify(rows, null, 2));
        setPreview({
          rows,
          extractionReviewRequired: extracted,
          extractionMethod: ocr ? 'ocr' : 'text',
          fileName: file.name,
          sourceKind: "manual_table",
          uploadTimestamp: new Date().toISOString(),
          columns: [...new Set(rows.flatMap(Object.keys))],
        });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not read document",
      );
    } finally {
      if (controller.current === abort) setBusy(false);
    }
  };
  return (
    <details className="rounded-lg border bg-background p-3">
      <summary className="cursor-pointer font-medium">
        Test data — upload document or enter examples
      </summary>
      <div className="mt-3 space-y-3">
        <label className="block text-sm">
          Document source{" "}
          <select
            className="ml-2 rounded border bg-background p-1"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
          >
            {sources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.label}
              </option>
            ))}
            <option value="new">Add a document source</option>
          </select>
        </label>
        <input
          aria-label="Upload test document"
          type="file"
          disabled={busy}
          accept=".xlsx,.xls,.csv,.tsv,.json,.txt,.pdf,.docx"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }}
        />
        {busy && <div role="status"><p>{progress}</p><button onClick={() => controller.current?.abort()}>Cancel upload</button></div>}
        {scanFile && <div role="status" className="rounded border p-3">
          <p>This document has no readable text layer and requires OCR. You can also enter records manually below.</p>
          <button disabled={!ocrAvailable || busy} onClick={() => void upload(scanFile, true)}>Read scanned document with OCR</button>
          {!ocrAvailable && <p>OCR is not configured on this server. Manual entry is available.</p>}
        </div>}
        <button
          className="block text-sm underline"
          onClick={() => setManual(!manual)}
        >
          Enter example data / JSON
        </button>
        {manual && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <input
                aria-label="Example text"
                className="rounded border bg-background p-2"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
              />
              <input
                aria-label="Example number"
                className="rounded border bg-background p-2"
                type="number"
                placeholder="Number (optional)"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
              <button
                onClick={() =>
                  setPreview({
                    sourceKind: "manual_table",
                    fileName: "Example data",
                    rows: [
                      {
                        rowId: "example-1",
                        label,
                        description: label,
                        ...(amount !== "" ? { amount: Number(amount) } : {}),
                      },
                    ],
                  })
                }
              >
                Preview example
              </button>
            </div>
            <textarea
              aria-label="Example records JSON"
              className="min-h-28 w-full rounded border bg-background p-2 font-mono text-xs"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder='[{"label":"Sales","amount":100}]'
            />
            <button
              onClick={() => {
                setPreview(null);
                try {
                  const rows = JSON.parse(text);
                  if (
                    !Array.isArray(rows) ||
                    !rows.every(
                      (row) =>
                        row && typeof row === "object" && !Array.isArray(row),
                    )
                  )
                    throw new Error("Enter a list of records");
                  setPreview({
                    sourceKind: "manual_table",
                    fileName: "Example data",
                    rows,
                  });
                } catch (error) {
                  toast.error(String(error));
                }
              }}
            >
              Preview JSON
            </button>
          </div>
        )}
        {preview && (
          <div className="space-y-3 border-t pt-3">
            <p className="text-sm">
              Check the extracted records before using them. Text without
              numbers can still be classified; enter numerical fields when
              needed for calculations.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                ["Text to classify", textField, setTextField],
                ["Number to calculate", numberField, setNumberField],
              ].map(([title, selected, setter]) => (
                <label className="text-sm" key={String(title)}>
                  {String(title)}{" "}
                  <select
                    className="rounded border bg-background p-1"
                    value={String(selected)}
                    onChange={(event) =>
                      (setter as (value: string) => void)(event.target.value)
                    }
                  >
                    <option value="">Use existing fields</option>
                    {(Array.isArray(preview.rows)
                      ? [
                          ...new Set(
                            preview.rows.flatMap((row) => Object.keys(row)),
                          ),
                        ]
                      : []
                    ).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <label className="block text-sm">Decimal separator <select aria-label="Document decimal separator" value={decimal} onChange={event => { setDecimal(event.target.value); setReviewed(false); }}><option value=".">Point: 1,234.56</option><option value=",">Comma: 1.234,56</option></select></label>
            <DocumentReviewTable rows={Array.isArray(preview.rows) ? preview.rows : []} numericFields={numericFields} onNumericFields={fields => { setNumericFields(fields); setReviewed(false); }} onChange={rows => { setPreview({ ...preview, rows }); setReviewed(false); }} />
            {Boolean(preview.extractionReviewRequired) && <label className="flex gap-2 text-sm"><input type="checkbox" aria-label="Confirm extracted values" checked={reviewed} onChange={event => setReviewed(event.target.checked)} />I checked the extracted values and selected the correct numeric fields. Numbers may represent dates or identifiers; they are not automatically treated as amounts.</label>}
            <details><summary>Original structured preview / JSON</summary><ReadableData value={preview.rows ?? preview} /></details>
            <button
              className="rounded bg-primary px-3 py-2 text-primary-foreground"
              disabled={busy || Boolean(preview.extractionReviewRequired) && !reviewed}
              onClick={apply}
            >
              Use this test data
            </button>
            <button className="ml-3" onClick={() => setPreview(null)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </details>
  );
}
