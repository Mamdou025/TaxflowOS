import "server-only";

// ─────────────────────────────────────────────────────────────────────────────
// Text extraction for RAG. Generalizes app/api/assistant/extract/route.ts (PDF via
// unpdf, Word via mammoth, plain text) and adds server-side spreadsheet extraction
// (xlsx → CSV per sheet). Unlike the chat-attachment route there is NO char cap —
// stored documents are chunked instead, so the whole document is indexed.
// ─────────────────────────────────────────────────────────────────────────────

export type ExtractKind = "pdf" | "word" | "excel" | "text" | "unknown";
export type ExtractResult = {
  text: string;
  pageCount: number | null;
  kind: ExtractKind;
};

const TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|log|yml|yaml|xml|html?|rtf)$/i;

function clean(text: string): string {
  return text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractText(
  bytes: Uint8Array,
  fileName: string,
  mimeType?: string | null
): Promise<ExtractResult> {
  const name = fileName || "document";
  const mime = mimeType ?? "";
  const isPdf = /\.pdf$/i.test(name) || mime === "application/pdf";
  const isDocx =
    /\.docx$/i.test(name) ||
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isXlsx = /\.(xlsx|xls)$/i.test(name) || mime.includes("spreadsheet");
  const isText = TEXT_EXT.test(name) || mime.startsWith("text/");

  if (isPdf) {
    const { extractText: pdfExtract, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(bytes);
    const { totalPages, text } = await pdfExtract(pdf, { mergePages: true });
    const merged = Array.isArray(text) ? text.join("\n\n") : text;
    return { text: clean(merged), pageCount: totalPages, kind: "pdf" };
  }

  if (isDocx) {
    const mod = await import("mammoth");
    const mammoth = mod.default ?? mod;
    const buffer = Buffer.from(bytes);
    const { value } = await mammoth.extractRawText({ buffer });
    return { text: clean(value ?? ""), pageCount: null, kind: "word" };
  }

  if (isXlsx) {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(bytes, { type: "array" });
    const parts: string[] = [];
    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName];
      if (!sheet) continue;
      const csv = XLSX.utils.sheet_to_csv(sheet);
      if (csv.trim()) parts.push(`# ${sheetName}\n${csv}`);
    }
    return {
      text: clean(parts.join("\n\n")),
      pageCount: wb.SheetNames.length,
      kind: "excel",
    };
  }

  if (isText) {
    const text = new TextDecoder().decode(bytes);
    return { text: clean(text), pageCount: null, kind: "text" };
  }

  return { text: "", pageCount: null, kind: "unknown" };
}
