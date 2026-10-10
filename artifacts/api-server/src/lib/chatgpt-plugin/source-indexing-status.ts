import type { DocumentExtraction } from '@workspace/workflow-contracts/domain/document-extraction';

/** Indexing failures cannot reclassify an already confirmed stored original. */
export async function queueStoredSourceIndexing(
  extraction: DocumentExtraction,
  operations: { enqueue: () => Promise<unknown>; markFailed: () => Promise<unknown> },
) {
  try {
    await operations.enqueue();
  } catch {
    extraction.issues.push({
      code: 'SEARCH_NOT_INDEXED',
      message: 'Original file saved in Sources; search indexing could not be queued.',
    });
    try {
      await operations.markFailed();
    } catch {
      // This status update is best effort. The extraction already reports the
      // indexing failure and retains its independently confirmed original ID.
    }
  }
}
