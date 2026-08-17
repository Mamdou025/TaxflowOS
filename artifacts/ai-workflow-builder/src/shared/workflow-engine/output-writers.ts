// ─────────────────────────────────────────────────────────────────────────────
// Real writers for the three Output blocks that were aliases.
//
// `output:pdf-report`, `output:taxprep-handoff` and `output:onesource-handoff`
// all resolved to `output.evidence_pack_preview` and emitted byte-identical
// output — three names, one artifact, none of them the thing promised.
//
//   • PDF Report now emits actual PDF bytes (a minimal, spec-conformant PDF 1.4
//     writer — no dependency, no renderer, deterministic output).
//   • Taxprep / ONESOURCE emit a DOCUMENTED GENERIC handoff: a flat CSV plus a
//     manifest declaring the schema version, the field mapping and the evidence
//     id behind every value. They are deliberately NOT labelled as native .ptf /
//     ONESOURCE files, because inventing a proprietary format that no system
//     accepts is worse than the alias was: it fails at the point of import, in
//     someone else's hands. The manifest is what makes the mapping honest work
//     rather than a guess.
//
// All three are pure and deterministic apart from a caller-supplied timestamp.
// ─────────────────────────────────────────────────────────────────────────────

export type HandoffRow = Record<string, unknown>;

// ── Minimal PDF writer ───────────────────────────────────────────────────────
// A PDF is a handful of numbered objects, a cross-reference table of their byte
// offsets, and a trailer. Text uses a base-14 font (Helvetica), so nothing has to
// be embedded. This is enough for a tabular report and avoids pulling a renderer
// into the bundle for one block.

const PAGE_WIDTH = 612; // US Letter, 72dpi
const PAGE_HEIGHT = 792;
const MARGIN = 48;
const LINE_HEIGHT = 14;
const FONT_SIZE = 9;
const TITLE_SIZE = 15;
const LINES_PER_PAGE = Math.floor((PAGE_HEIGHT - MARGIN * 2 - 40) / LINE_HEIGHT);

/** Escape the three characters that are structural inside a PDF string literal. */
function pdfEscape(text: string): string {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    // PDF base-14 fonts are single-byte; drop anything outside WinAnsi range
    // rather than emitting bytes that would render as garbage.
    .replaceAll(/[^\x20-\x7E]/g, "?");
}

function pageContentStream(lines: string[], title?: string): string {
  const parts: string[] = ["BT"];
  let y = PAGE_HEIGHT - MARGIN;

  if (title) {
    parts.push(`/F2 ${TITLE_SIZE} Tf`, `1 0 0 1 ${MARGIN} ${y} Tm`, `(${pdfEscape(title)}) Tj`);
    y -= LINE_HEIGHT * 2;
  }

  parts.push(`/F1 ${FONT_SIZE} Tf`);
  for (const line of lines) {
    parts.push(`1 0 0 1 ${MARGIN} ${y} Tm`, `(${pdfEscape(line)}) Tj`);
    y -= LINE_HEIGHT;
  }
  parts.push("ET");
  return parts.join("\n");
}

/**
 * Build a valid PDF document from pre-laid-out text pages.
 * Returns the file as a string of single-byte characters (latin1), which the
 * caller base64-encodes for download.
 */
export function buildPdf({
  pages,
  title,
}: {
  pages: string[][];
  title: string;
}): string {
  const objects: string[] = [];
  const pageCount = Math.max(pages.length, 1);
  // Object numbering: 1 catalog, 2 pages tree, 3 font F1, 4 font F2,
  // then per page: content stream and page object.
  const firstPageObj = 5;
  const pageObjIds: number[] = [];
  const contentObjs: string[] = [];

  for (let index = 0; index < pageCount; index += 1) {
    const contentId = firstPageObj + index * 2;
    const pageId = contentId + 1;
    pageObjIds.push(pageId);
    const stream = pageContentStream(pages[index] ?? [], index === 0 ? title : undefined);
    contentObjs.push(
      `${contentId} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`
    );
    contentObjs.push(
      `${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`
    );
  }

  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  objects.push(
    `2 0 obj\n<< /Type /Pages /Count ${pageCount} /Kids [${pageObjIds
      .map((id) => `${id} 0 R`)
      .join(" ")}] >>\nendobj\n`
  );
  objects.push(
    "3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n"
  );
  objects.push(
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n"
  );
  objects.push(...contentObjs);

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += object;
  }

  const xrefStart = pdf.length;
  const count = objects.length + 1;
  let xref = `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += xref;
  pdf += `trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return pdf;
}

/** Lay rows out as fixed-width text columns and paginate. */
export function paginateTable({
  columns,
  rows,
  summary = [],
}: {
  columns: string[];
  rows: HandoffRow[];
  summary?: string[];
}): string[][] {
  const widths = columns.map((column) =>
    Math.max(
      column.length,
      ...rows.map((row) => String(row[column] ?? "").length),
      6
    )
  );
  // Keep the whole line inside the printable width.
  const budget = Math.floor((PAGE_WIDTH - MARGIN * 2) / (FONT_SIZE * 0.55));
  const scaled = widths.map((width) =>
    Math.max(6, Math.floor((width / widths.reduce((a, b) => a + b, 0)) * budget))
  );

  const line = (cells: unknown[]) =>
    cells
      .map((cell, index) => String(cell ?? "").slice(0, scaled[index]).padEnd(scaled[index]))
      .join(" ")
      .trimEnd();

  const body = [
    line(columns),
    scaled.map((width) => "-".repeat(width)).join(" "),
    ...rows.map((row) => line(columns.map((column) => row[column]))),
  ];
  if (summary.length > 0) {
    body.push("", ...summary);
  }

  const pages: string[][] = [];
  for (let index = 0; index < body.length; index += LINES_PER_PAGE) {
    pages.push(body.slice(index, index + LINES_PER_PAGE));
  }
  return pages.length > 0 ? pages : [[]];
}

// ── Documented generic handoff ───────────────────────────────────────────────

export const HANDOFF_SCHEMA_VERSION = "sinaxe-handoff/1.0";

/** The columns every handoff emits, in order, with what each one means. */
export const HANDOFF_FIELDS: { key: string; description: string }[] = [
  { key: "field_code", description: "Stable identifier for the figure (the engine's result key)." },
  { key: "label", description: "Human label as shown on the worksheet." },
  { key: "value", description: "The figure itself, unformatted." },
  { key: "currency", description: "ISO currency of `value`, blank for rates and counts." },
  { key: "formula", description: "How the figure was derived, when the engine recorded one." },
  { key: "source_block", description: "Id of the block that produced it." },
  { key: "evidence_id", description: "Evidence reference behind the figure, for audit." },
];

function csvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function buildHandoff({
  generatedAt,
  rows,
  target,
  workflowName,
}: {
  generatedAt: string;
  rows: HandoffRow[];
  /** "taxprep" | "onesource" — recorded in the manifest, not faked as native. */
  target: string;
  workflowName: string;
}) {
  const columns = HANDOFF_FIELDS.map((field) => field.key);
  const csv = [
    columns.join(","),
    ...rows.map((row) => columns.map((key) => csvCell(row[key])).join(",")),
  ].join("\n");

  return {
    csv,
    fileName: `${target}-handoff.csv`,
    manifest: {
      // Stated plainly so nobody mistakes this for a vendor-native file.
      format: "generic-tabular",
      isNativeVendorFormat: false,
      note: `Generic tabular handoff for ${target}. Map field_code to the target system's field on import; the manifest below declares every column and the evidence behind each value.`,
      fields: HANDOFF_FIELDS,
      generatedAt,
      rowCount: rows.length,
      schemaVersion: HANDOFF_SCHEMA_VERSION,
      target,
      workflowName,
    },
    manifestFileName: `${target}-handoff-manifest.json`,
    rowCount: rows.length,
  };
}
