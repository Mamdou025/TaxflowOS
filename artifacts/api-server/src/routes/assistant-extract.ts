// ─────────────────────────────────────────────────────────────────────────────
// Attachment text extraction — turns an uploaded document into plain text the
// assistant can actually read. Mounted at /api/assistant/extract.
//
//   POST /api/assistant/extract   (multipart/form-data, field `file`)
//     → { fileName, kind, chars, pages?, truncated, text }
//     → { error } with 4xx/5xx on failure
//
// This is the INLINE-CONTEXT path for chat attachments and the document viewer
// (distinct from the persistent RAG store under /api/documents): the whole
// extracted text is handed to the model as readable context on the next turn, so
// it is capped (~120k chars ≈ 30k tokens) and truncation is flagged. Extracts the
// TEXT LAYER only — scanned/image-only PDFs come back empty (would need OCR).
// Workbooks (.xlsx/.xls) keep their own row-parse path in the client.
//
// Ported from the web app's Next.js route (app/api/assistant/extract). Multipart is
// parsed with multer (memory storage) since Express doesn't handle it natively.
// ─────────────────────────────────────────────────────────────────────────────

import { Router, type Request, type Response } from "express";
import multer from "multer";

const router = Router();

// Memory storage — the buffer is parsed in-process and discarded; nothing is
// persisted here (persistence is the /api/documents path). 50 MB is a generous
// ceiling for a document the model will read inline.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

/** Cap the extracted text we hand back — the whole document goes to the model as
 *  readable context on every turn, so an unbounded PDF would balloon cost/latency.
 *  ~120k chars ≈ 30k tokens; truncation is flagged so the tail-cut is visible. */
const MAX_CHARS = 120_000;

const TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|log|yml|yaml|xml|html?|rtf)$/i;
const PDF_EXT = /\.pdf$/i;
const DOCX_EXT = /\.docx$/i;

function clean(text: string): { text: string; truncated: boolean } {
  const normalized = text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (normalized.length <= MAX_CHARS) return { text: normalized, truncated: false };
  return { text: normalized.slice(0, MAX_CHARS), truncated: true };
}

type Kind = "pdf" | "word" | "text" | "unsupported";

function getFileKind(name: string, mime: string): Kind {
  if (PDF_EXT.test(name) || mime === "application/pdf") return "pdf";
  if (
    DOCX_EXT.test(name) ||
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "word";
  }
  if (TEXT_EXT.test(name) || mime.startsWith("text/")) return "text";
  return "unsupported";
}

async function handleExtract(req: Request, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No `file` provided." });
    return;
  }

  const name = file.originalname || "document";
  const mime = file.mimetype || "";
  const kind = getFileKind(name, mime);

  try {
    if (kind === "pdf") {
      const { extractText, getDocumentProxy } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(file.buffer));
      const { totalPages, text } = await extractText(pdf, { mergePages: true });
      const merged = Array.isArray(text) ? text.join("\n\n") : text;
      const { text: out, truncated } = clean(merged);
      if (!out) {
        res.status(422).json({
          error:
            "This PDF has no embedded text layer (it looks scanned/image-only). Text extraction found nothing — it would need OCR.",
        });
        return;
      }
      res.json({
        fileName: name,
        kind: "pdf",
        pages: totalPages,
        chars: out.length,
        truncated,
        text: out,
      });
      return;
    }

    if (kind === "word") {
      const mod = await import("mammoth");
      const mammoth = mod.default ?? mod;
      const { value } = await mammoth.extractRawText({ buffer: file.buffer });
      const { text: out, truncated } = clean(value ?? "");
      if (!out) {
        res.status(422).json({ error: `"${name}" had no extractable text.` });
        return;
      }
      res.json({ fileName: name, kind: "word", chars: out.length, truncated, text: out });
      return;
    }

    if (kind === "text") {
      const { text: out, truncated } = clean(file.buffer.toString("utf-8"));
      res.json({ fileName: name, kind: "text", chars: out.length, truncated, text: out });
      return;
    }

    res.status(415).json({
      error: `Unsupported file type "${name}". Supported: PDF, Word (.docx), and plain-text documents (txt, md, csv, json, …). Workbooks (.xlsx/.xls) load as rows.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(422).json({ error: `Couldn't read "${name}": ${message}` });
  }
}

router.post("/extract", (req, res) => {
  upload.single("file")(req, res, (err: unknown) => {
    if (err) {
      const message =
        err instanceof Error ? err.message : "Expected multipart/form-data with a `file` field.";
      res.status(400).json({ error: message });
      return;
    }
    void handleExtract(req, res);
  });
});

export default router;
