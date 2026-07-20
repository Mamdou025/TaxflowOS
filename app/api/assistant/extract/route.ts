// ─────────────────────────────────────────────────────────────────────────────
// Attachment text extraction API — turns an uploaded document into plain text the
// assistant can actually read.
//
//   POST /api/assistant/extract   (multipart/form-data, field `file`)
//     → { fileName, kind, chars, pages?, truncated, text }
//     → { error } with 4xx/5xx on failure
//
// This is the missing half of chat attachments: the composer used to drop only a
// `[Attached name.pdf]` tag into the message, so the model never saw the content.
// Here we extract the TEXT LAYER (no OCR — scanned/image-only PDFs come back empty
// and are reported as such). Workbooks (.xlsx/.xls) keep their own row-parse path
// in the client (parseUploadToRows); this route covers PDFs and plain-text docs.
//
// Runs on the Node runtime (unpdf/pdf.js need it). Fail-soft: any parse error is a
// clean 422 the client turns into a short "couldn't read it" note.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** Cap the extracted text we hand back. The whole document is sent to the model as
 *  readable context on every turn, so an unbounded 500-page PDF would balloon cost
 *  and latency. ~120k chars ≈ 30k tokens — generous for a document Q&A, and we flag
 *  truncation so the model (and user) know the tail was cut. */
const MAX_CHARS = 120_000;

/** Extensions we read as UTF-8 text directly — no library needed. */
const TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|log|yml|yaml|xml|html?|rtf)$/i;

function clean(text: string): { text: string; truncated: boolean } {
  // Collapse the runs of blank lines pdf.js tends to emit, trim trailing spaces.
  const normalized = text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (normalized.length <= MAX_CHARS) return { text: normalized, truncated: false };
  return { text: normalized.slice(0, MAX_CHARS), truncated: true };
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data with a `file` field.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No `file` provided.' }, { status: 400 });
  }

  const name = file.name || 'document';
  const isPdf = /\.pdf$/i.test(name) || file.type === 'application/pdf';
  const isText = TEXT_EXT.test(name) || file.type.startsWith('text/');

  try {
    if (isPdf) {
      const { extractText, getDocumentProxy } = await import('unpdf');
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await getDocumentProxy(bytes);
      const { totalPages, text } = await extractText(pdf, { mergePages: true });
      const merged = Array.isArray(text) ? text.join('\n\n') : text;
      const { text: out, truncated } = clean(merged);
      if (!out) {
        // A real PDF with no extractable text = scanned/image-only → needs OCR.
        return NextResponse.json(
          { error: 'This PDF has no embedded text layer (it looks scanned/image-only). Text extraction found nothing — it would need OCR.' },
          { status: 422 },
        );
      }
      return NextResponse.json({ fileName: name, kind: 'pdf', pages: totalPages, chars: out.length, truncated, text: out });
    }

    if (/\.docx$/i.test(name) || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const mammoth = (await import('mammoth')).default ?? (await import('mammoth'));
      const buffer = Buffer.from(await file.arrayBuffer());
      const { value } = await mammoth.extractRawText({ buffer });
      const { text: out, truncated } = clean(value ?? '');
      if (!out) {
        return NextResponse.json({ error: `"${name}" had no extractable text.` }, { status: 422 });
      }
      return NextResponse.json({ fileName: name, kind: 'word', chars: out.length, truncated, text: out });
    }

    if (isText) {
      const raw = await file.text();
      const { text: out, truncated } = clean(raw);
      return NextResponse.json({ fileName: name, kind: 'text', chars: out.length, truncated, text: out });
    }

    return NextResponse.json(
      { error: `Unsupported file type "${name}". Supported: PDF, Word (.docx), and plain-text documents (txt, md, csv, json, …). Workbooks (.xlsx/.xls) load as rows.` },
      { status: 415 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Couldn't read "${name}": ${message}` }, { status: 422 });
  }
}
