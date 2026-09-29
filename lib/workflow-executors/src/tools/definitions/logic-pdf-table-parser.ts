import { type ToolDefinition } from '../types';
import { createParserTool } from '../parser-tools';

export const logicPdfTableParserTool: ToolDefinition = createParserTool({
  displayName: 'PDF Table Parser',
  subtype: 'PDF Table Parser',
  toolId: 'logic.pdf_table_parser',
});
