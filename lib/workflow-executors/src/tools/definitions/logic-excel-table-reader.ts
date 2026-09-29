import { type ToolDefinition } from '../types';
import { createParserTool } from '../parser-tools';

export const logicExcelTableReaderTool: ToolDefinition = createParserTool({
  displayName: 'Excel Table Reader',
  subtype: 'Excel Table Reader',
  toolId: 'logic.excel_table_reader',
});
