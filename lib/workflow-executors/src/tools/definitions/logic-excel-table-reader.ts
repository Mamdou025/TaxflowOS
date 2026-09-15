import { type ToolDefinition } from '../types';
import { createMockParserTool } from '../parser-tools';

export const logicExcelTableReaderTool: ToolDefinition = createMockParserTool({
  displayName: 'Excel Table Reader',
  subtype: 'Excel Table Reader',
  toolId: 'logic.excel_table_reader',
});
