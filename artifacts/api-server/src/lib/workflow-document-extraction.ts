import { createHash, randomUUID } from 'node:crypto';
import type { DocumentExtraction } from '@workspace/workflow-contracts/domain/document-extraction';

export class ExtractionTooLargeError extends Error {}

/** Native extraction only. OCR remains an explicit provider operation in the route. */
export async function extractWorkflowDocument(
  bytes: Uint8Array,
  fileName: string,
): Promise<DocumentExtraction> {
  const extraction: DocumentExtraction = {
    id: randomUUID(),
    revision: 1,
    fileName,
    contentHash: `sha256:${createHash('sha256').update(bytes).digest('hex')}`,
    extractedAt: new Date().toISOString(),
    method: 'pdf_text',
    segments: [],
    rows: [],
    issues: [],
  };
  if (/\.pdf$/i.test(fileName)) {
    const { extractText, getDocumentProxy } = await import('unpdf');
    const pdf = await getDocumentProxy(bytes);
    try {
      const { text } = await extractText(pdf, { mergePages: false });
      extraction.segments = text.map((text, index) => ({
        id: `page-${index + 1}`,
        location: `Page ${index + 1}`,
        page: index + 1,
        text,
      }));
      if (text.some((page) => !page.trim()))
        extraction.issues.push({
          code: 'EMPTY_PAGES',
          message:
            'Some pages have no extractable text. They may require OCR; document completeness has not been established.',
        });
    } finally {
      await pdf.destroy();
    }
  } else if (/\.docx$/i.test(fileName)) {
    const { extractRawText } = await import('mammoth');
    const result = await extractRawText({ buffer: Buffer.from(bytes) });
    extraction.method = 'docx_text';
    extraction.segments = result.value
      .split(/\n\s*\n/)
      .filter((text) => text.trim())
      .map((text, index) => ({
        id: `paragraph-${index + 1}`,
        location: `Extracted paragraph ${index + 1}`,
        text,
      }));
    extraction.issues.push(
      ...result.messages.map((message) => ({ code: 'DOCX_NOTICE', message: message.message })),
    );
  } else {
    throw new Error('Use a PDF or Word document.');
  }
  if (extraction.segments.reduce((length, segment) => length + segment.text.length, 0) > 1_000_000)
    throw new ExtractionTooLargeError(
      'This document has too much text for one extraction. Split it into smaller documents; nothing was truncated or applied.',
    );
  extraction.issues.push({
    code: 'TEXT_ONLY',
    message:
      'Text extraction does not establish table structure, numerical meaning, or completeness. Review the original document before using financial values.',
  });
  return extraction;
}
