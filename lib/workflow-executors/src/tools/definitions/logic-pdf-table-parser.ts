import { type ToolDefinition } from '../types';
import { createMockParserTool } from '../parser-tools';

export const logicPdfTableParserTool: ToolDefinition = createMockParserTool({
  displayName: 'PDF Table Parser',
  subtype: 'PDF Table Parser',
  toolId: 'logic.pdf_table_parser',
});
