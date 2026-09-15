import { type ToolDefinition } from '../types';
import { createMockParserTool } from '../parser-tools';

export const logicOcrExtractTool: ToolDefinition = createMockParserTool({
  displayName: 'OCR Extractor',
  subtype: 'OCR Extractor',
  toolId: 'logic.ocr_extract',
});
