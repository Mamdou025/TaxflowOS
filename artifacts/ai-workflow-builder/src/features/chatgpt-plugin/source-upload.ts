import { z } from 'zod';
import type { HostBridge } from './host-bridge';
import type { WorkflowView } from './view-contract';

export const sourceInspectionSchema = z.object({
  uploadId: z.string().min(1),
  fileName: z.string(),
  kind: z.enum(['workbook', 'document', 'json']),
  sheets: z
    .array(
      z.object({
        sheetName: z.string(),
        headers: z.array(z.string()),
        detectedHeaderRowNumber: z.number().int().positive(),
        previewRows: z.array(z.array(z.string())),
      }),
    )
    .default([]),
});
export const capturedSourceSchema = z.object({
  captureId: z.string().min(1),
  fileName: z.string(),
  rowCount: z.number().int().nonnegative(),
  previewRows: z.array(z.record(z.unknown())).default([]),
  issues: z.array(z.object({ code: z.string(), message: z.string() })).default([]),
});
export type SourceInspection = z.infer<typeof sourceInspectionSchema>;
export type CapturedSource = z.infer<typeof capturedSourceSchema>;
export type WorkbookSelection = {
  sheetName: string;
  headerRowNumber: number;
  mapping: Record<string, string>;
  currency?: string;
};

/** Raw bytes are staged by the authenticated host. Capturing never replaces a run source. */
export async function stageSourceFile(
  view: WorkflowView,
  bridge: HostBridge,
  blockId: string,
  file: File,
  active: () => boolean,
  progress: (percent: number) => void,
) {
  if (!file.size || file.size > 20 * 1024 * 1024)
    throw new Error('Choose a nonempty file of at most 20 MB.');
  if (!/\.(xlsx|xls|json|pdf|docx)$/i.test(file.name))
    throw new Error('Choose an Excel, JSON, PDF or Word source.');
  const assertActive = () => {
    if (!active()) throw new Error('Import cancelled. The existing source was preserved.');
  };
  const started = z
    .object({ uploadId: z.string().min(1), chunkBytes: z.number().int().positive().max(49152) })
    .parse(
      await bridge.request(view, 'begin_workflow_source', {
        workflowId: view.workflowId,
        runId: view.runId,
        blockId,
        expectedRevision: view.inspection?.revision,
        fileName: file.name,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
      }),
    );
  for (let offset = 0; offset < file.size; offset += started.chunkBytes) {
    assertActive();
    const bytes = new Uint8Array(
      await file.slice(offset, offset + started.chunkBytes).arrayBuffer(),
    );
    assertActive();
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const appended = z.object({ offset: z.number().int().nonnegative() }).parse(
      await bridge.request(view, 'append_workflow_source', {
        uploadId: started.uploadId,
        offset,
        base64: btoa(binary),
      }),
    );
    if (appended.offset !== offset + bytes.length)
      throw new Error(
        'The server did not confirm these file bytes. The existing source was preserved.',
      );
    progress(Math.round((appended.offset / file.size) * 100));
  }
  assertActive();
  const inspected = sourceInspectionSchema.parse(
    await bridge.request(view, 'inspect_workflow_source', { uploadId: started.uploadId }),
  );
  assertActive();
  if (inspected.uploadId !== started.uploadId || inspected.fileName !== file.name)
    throw new Error('The uploaded source identity could not be verified.');
  return inspected;
}
