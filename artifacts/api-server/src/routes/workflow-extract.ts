import { Router } from 'express';
import multer from 'multer';
import { isOcrConfigured, ocrDocument } from '../lib/rag/ocr';
const router = Router();
// Warm parser modules during server startup, before a user chooses a document.
// Extraction itself remains explicit and processes only the uploaded file.
void Promise.allSettled([import('unpdf'), import('mammoth')]);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
router.post('/workflow-extract', (req, res) => {
  upload.single('file')(req, res, async error => {
    if (error) { res.status(413).json({ error: 'Use a document smaller than 20 MB.' }); return; }
    const file = req.file;
    if (!file) { res.status(400).json({ error: 'Choose a document.' }); return; }
    try {
      let text = '';
      let method = 'text';
      if (/\.pdf$/i.test(file.originalname)) {
        const { extractText, getDocumentProxy } = await import('unpdf');
        const pdf = await getDocumentProxy(new Uint8Array(file.buffer));
        try { text = (await extractText(pdf, { mergePages: true })).text; } finally { await pdf.destroy(); }
      } else if (/\.docx$/i.test(file.originalname)) {
        const { extractRawText } = await import('mammoth');
        text = (await extractRawText({ buffer: file.buffer })).value;
      } else { res.status(415).json({ error: 'Use a PDF or Word document.' }); return; }
      if (!text.trim() && req.body.ocr === 'true') {
        if (!isOcrConfigured()) { res.status(503).json({ error: 'OCR is not configured on this server. Enter the values manually or upload a text-based document.' }); return; }
        text = await ocrDocument(new Uint8Array(file.buffer), file.originalname, file.mimetype);
        method = 'ocr';
      }
      if (!text.trim()) { res.json({ text: '', needsOcr: true, ocrAvailable: isOcrConfigured(), method }); return; }
      if (text.length > 1_000_000) { res.status(413).json({ error: 'This document has too much text for one extraction. Split it into smaller documents; nothing was truncated or applied.' }); return; }
      res.json({ text, method, needsOcr: false });
    } catch (error) { res.status(422).json({ error: error instanceof Error ? error.message : 'Could not extract this document.' }); }
  });
});
export default router;
