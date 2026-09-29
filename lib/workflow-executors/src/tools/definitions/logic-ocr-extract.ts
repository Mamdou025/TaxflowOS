import { type ToolDefinition } from '../types';
import { createParserTool } from '../parser-tools';

export const logicOcrExtractTool: ToolDefinition = createParserTool({
  displayName: 'OCR Extractor',
  subtype: 'OCR Extractor',
  toolId: 'logic.ocr_extract',
});
