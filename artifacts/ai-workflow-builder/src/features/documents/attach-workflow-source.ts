import { parseUploadToRows, type SelectWorkbook, type WorkbookSelection } from '@/shared/workflow-engine/runtime/workflow-runs/parse-upload';
import type { UploadedSource } from '@/shared/stores/workspace-store';
import { uploadDocument } from './upload-client';
import { loadWorkflowSource } from './workflow-source-client';

export async function attachWorkflowSource(
  file: File,
  selectWorkbook?: SelectWorkbook,
): Promise<{ source: UploadedSource; notice: string }> {
  let selection: WorkbookSelection | undefined;
  const parsed = await parseUploadToRows(file, { selectWorkbook: selectWorkbook ? async workbook => {
    selection = await selectWorkbook(workbook);
    return selection;
  } : undefined });
  const local = { ...parsed, at: Date.now() };
  const uploaded = await uploadDocument(file);
  if (!uploaded.documentId)
    return {
      source: local,
      notice: `Available in this browser, but not saved in Sources: ${uploaded.error}`,
    };
  try {
    return {
      source: await loadWorkflowSource(uploaded.documentId, { selection }),
      notice: 'Saved in Sources and selected for the next workflow run.',
    };
  } catch (error) {
    return {
      source: local,
      notice: `The upload was stored, but could not be reloaded from Sources: ${error instanceof Error ? error.message : 'Please retry.'}`,
    };
  }
}
