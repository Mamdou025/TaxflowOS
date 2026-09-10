import { useState } from "react";
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
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [manual, setManual] = useState(false);
  const [text, setText] = useState("");
  const [label, setLabel] = useState("Example record");
  const [amount, setAmount] = useState("");
  const [textField, setTextField] = useState("");
  const [numberField, setNumberField] = useState("");
  const apply = () => {
    if (!preview) return;
    const existing = sources.find((source) => source.id === target);
    const block =
      existing ??
      createWorkflowBlockFromCatalog("source:excel-workbook", {
        id: crypto.randomUUID(),
        label: "Document",
        position: { x: 0, y: 0 },
      });
    const rows = Array.isArray(preview.rows)
      ? preview.rows.map((row, index) => ({
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
  const upload = async (file: File) => {
    setBusy(true);
    setPreview(null);
    setTextField("");
    setNumberField("");
    try {
      const extension = file.name.split(".").pop()?.toLowerCase();
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
        setPreview(patch);
      } else {
        let rows: Record<string, unknown>[];
        if (extension === "csv" || extension === "tsv") {
          const XLSX = await import("xlsx");
          const workbook = XLSX.read(await file.text(), {
            type: "string",
            raw: true,
          });
          rows = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]],
            { defval: null },
          );
        } else if (extension === "json") {
          const value = JSON.parse(await file.text());
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
          let content = await file.text();
          if (extension === "pdf") {
            const { extractText, getDocumentProxy } = await import("unpdf");
            const pdf = await getDocumentProxy(
              new Uint8Array(await file.arrayBuffer()),
            );
            const extracted = await extractText(pdf, { mergePages: true });
            content = extracted.text;
            await pdf.destroy();
          } else if (extension === "docx") {
            const mammoth = await import("mammoth");
            content = (
              await mammoth.extractRawText({
                arrayBuffer: await file.arrayBuffer(),
              })
            ).value;
          }
          rows = content
            .split(/\r?\n/)
            .filter((line) => line.trim())
            .map((line, i) => ({
              rowId: `row-${i + 1}`,
              label: line,
              description: line,
            }));
        }
        if (!rows.length)
          throw new Error(
            "No readable records found. For scanned documents, enter the extracted values manually.",
          );
        setText(JSON.stringify(rows, null, 2));
        setPreview({
          rows,
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
      setBusy(false);
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
        {busy && <p>Reading document…</p>}
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
            <ReadableData value={preview.rows ?? preview} />
            <button
              className="rounded bg-primary px-3 py-2 text-primary-foreground"
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
