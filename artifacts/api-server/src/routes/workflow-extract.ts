import { Router } from 'express';
import multer from 'multer';
import { isOcrConfigured, ocrDocument } from '../lib/rag/ocr';
import {
  extractWorkflowDocument,
  ExtractionTooLargeError,
} from '../lib/workflow-document-extraction';
const router = Router();
// Warm parser modules during server startup, before a user chooses a document.
// Extraction itself remains explicit and processes only the uploaded file.
void Promise.allSettled([import('unpdf'), import('mammoth')]);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
router.post('/workflow-extract', (req, res) => {
  upload.single('file')(req, res, async (error) => {
    if (error) {
      res.status(413).json({ error: 'Use a document smaller than 20 MB.' });
      return;
    }
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'Choose a document.' });
      return;
    }
    if (!/\.(pdf|docx)$/i.test(file.originalname)) {
      res.status(415).json({ error: 'Use a PDF or Word document.' });
      return;
    }
    try {
      const extraction = await extractWorkflowDocument(
        new Uint8Array(file.buffer),
        file.originalname,
      );
      let text = extraction.segments.map((segment) => segment.text).join('\n\n');
      let method = 'text';
      if (!text.trim() && req.body.ocr === 'true') {
        if (!isOcrConfigured()) {
          res
            .status(503)
            .json({
              error:
                'OCR is not configured on this server. Enter the values manually or upload a text-based document.',
            });
          return;
        }
        text = await ocrDocument(new Uint8Array(file.buffer), file.originalname, file.mimetype);
        method = 'ocr';
        extraction.method = 'ocr';
        extraction.segments = [
          { id: 'document', location: 'Document (OCR; page locations unavailable)', text },
        ];
        extraction.issues = [
          {
            code: 'OCR_REVIEW',
            message:
              'Model transcription requires comparison with the original. Page locations and table structure are unavailable.',
          },
        ];
      }
      if (!text.trim()) {
        res.json({ text: '', needsOcr: true, ocrAvailable: isOcrConfigured(), method });
        return;
      }
      if (text.length > 1_000_000) {
        res
          .status(413)
          .json({
            error:
              'This document has too much text for one extraction. Split it into smaller documents; nothing was truncated or applied.',
          });
        return;
      }
      res.json({ text, method, needsOcr: false, extraction });
    } catch (error) {
      res
        .status(error instanceof ExtractionTooLargeError ? 413 : 422)
        .json({
          error: error instanceof Error ? error.message : 'Could not extract this document.',
        });
    }
  });
});
export default router;
