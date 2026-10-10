import {
  parseUploadToRows as parse,
  type UploadOptions,
} from '@workspace/source-connectors/workbook-upload';
import { parseExcelWorkbookFile } from '@/shared/workflow-engine/parsing/excel-utils';
export type {
  ParsedUpload,
  WorkbookSelection,
  SelectWorkbook,
  UploadOptions,
} from '@workspace/source-connectors/workbook-upload';
export function parseUploadToRows(file: File, options: UploadOptions = {}) {
  return parse(file, parseExcelWorkbookFile, options);
}
