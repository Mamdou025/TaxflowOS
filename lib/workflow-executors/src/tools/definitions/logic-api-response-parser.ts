import { type ToolDefinition } from '../types';
import { createParserTool } from '../parser-tools';

export const logicApiResponseParserTool: ToolDefinition = createParserTool({
  displayName: 'API Response Parser',
  subtype: 'API Response Parser',
  toolId: 'logic.api_response_parser',
});
