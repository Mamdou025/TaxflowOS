import { parseDelimitedRecords, textDocumentRecords } from './document-records';
self.onmessage = (event: MessageEvent<{ text: string; extension: string }>) => {
  try { self.postMessage({ rows: ['csv', 'tsv'].includes(event.data.extension) ? parseDelimitedRecords(event.data.text, event.data.extension === 'tsv' ? '\t' : ',') : textDocumentRecords(event.data.text) }); }
  catch (error) { self.postMessage({ error: error instanceof Error ? error.message : 'Document parsing failed.' }); }
};
