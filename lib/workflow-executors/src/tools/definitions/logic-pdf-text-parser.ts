import { type ToolDefinition } from '../types';
import { createMockParserTool } from '../parser-tools';

export const logicPdfTextParserTool: ToolDefinition = createMockParserTool({
  displayName: 'PDF Text Parser',
  subtype: 'PDF Text Parser',
  toolId: 'logic.pdf_text_parser',
});
