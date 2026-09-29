/** A captured extraction, replayed by workflows without fetching or reinterpreting the file. */
export type DocumentExtraction = {
  id: string;
  revision: number;
  fileName: string;
  contentHash: string;
  extractedAt: string;
  method: 'pdf_text' | 'docx_text' | 'ocr' | 'workbook' | 'json';
  originalDocumentId?: string;
  segments: { id: string; location: string; page?: number; text: string }[];
  rows: Record<string, unknown>[];
  issues: { code: string; message: string }[];
};
