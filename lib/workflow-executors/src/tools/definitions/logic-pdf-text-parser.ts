import { type ToolDefinition } from '../types';
import { createParserTool } from '../parser-tools';

export const logicPdfTextParserTool: ToolDefinition = createParserTool({
  displayName: 'PDF Text Parser',
  subtype: 'PDF Text Parser',
  toolId: 'logic.pdf_text_parser',
});
