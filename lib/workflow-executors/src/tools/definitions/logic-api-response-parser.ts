import { type ToolDefinition } from '../types';
import { createMockParserTool } from '../parser-tools';

export const logicApiResponseParserTool: ToolDefinition = createMockParserTool({
  displayName: 'API Response Parser',
  subtype: 'API Response Parser',
  toolId: 'logic.api_response_parser',
});
