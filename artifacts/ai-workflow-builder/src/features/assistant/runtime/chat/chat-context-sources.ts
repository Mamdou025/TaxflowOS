import { apiFetch } from '@/platform/auth/api-fetch';
import { uploadDocument } from '@/features/documents/upload-client';
import {
  loadWorkflowSource,
  isWorkflowSource,
  type WorkflowSourceDocument,
} from '@/features/documents/workflow-source-client';
import type { SelectWorkbook } from '@/shared/workflow-engine/runtime/workflow-runs/parse-upload';
import { uploadedRowsAtom, type UploadedSource } from '@/shared/stores/workspace-store';
import {
  CHAT_TEXT_LIMIT,
  assertSourceRevision,
  type ChatSourceReference,
  type ChatTextSnapshot,
} from './chat-context-model';
import {
  attachChatContextSource,
  assertChatContextCurrent,
  chatContextAtom,
  chatContextEpochAtom,
  chatContextLockedAtom,
  loadedChatSourcesAtom,
  localSourceKey,
  syncChatSourceAdapters,
  type ContextStore,
  type LoadedChatSource,
} from './chat-context-store';

async function fileHash(file: Blob) {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return `sha256:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}
async function extractText(file: File): Promise<ChatTextSnapshot> {
  const body = new FormData();
  body.append('file', file);
  const response = await apiFetch('/api/assistant/extract', {
    method: 'POST',
    body,
    signal: AbortSignal.timeout(60000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? 'The document could not be read.');
  if (typeof data.text !== 'string' || !['pdf', 'word', 'text', 'excel'].includes(data.kind))
    throw new Error('The document returned invalid text.');
  return {
    text: data.text.slice(0, CHAT_TEXT_LIMIT),
    kind: data.kind,
    truncated: !!data.truncated || data.text.length > CHAT_TEXT_LIMIT,
    ...(Number.isInteger(data.pages) && data.pages > 0 ? { pages: data.pages } : {}),
  };
}
function workbookText(source: UploadedSource): ChatTextSnapshot {
  const text = JSON.stringify(source.rows);
  return {
    kind: 'excel',
    text: text.slice(0, CHAT_TEXT_LIMIT),
    truncated: text.length > CHAT_TEXT_LIMIT,
  };
}
export function sourceReference(document: WorkflowSourceDocument): ChatSourceReference {
  return {
    id: document.id,
    sourceId: document.id,
    fileName: document.fileName,
    kind: isWorkflowSource(document) ? 'workbook' : 'document',
    sourceRevision: document.sourceRevision,
    contentHash: document.contentHash,
    mimeType: document.mimeType,
  };
}
async function verifyLoadedReference(reference: ChatSourceReference) {
  if (!reference.sourceId) return;
  const response = await apiFetch(`/api/documents/${encodeURIComponent(reference.sourceId)}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error('This source is unavailable or you no longer have access.');
  const { document } = (await response.json()) as { document: WorkflowSourceDocument };
  assertSourceRevision(reference, document);
}
async function loadReference(
  reference: ChatSourceReference,
  store: ContextStore,
  selectWorkbook?: SelectWorkbook,
): Promise<{ reference: ChatSourceReference; loaded: LoadedChatSource }> {
  if (!reference.sourceId) {
    if (reference.kind === 'document' && reference.localText)
      return { reference, loaded: { status: 'ready', text: reference.localText } };
    const cached = store.get(uploadedRowsAtom)[localSourceKey(reference.id)];
    if (!cached || cached.contentHash !== reference.fileHash)
      throw new Error(
        'This local attachment is unavailable in this browser. Attach the original file again.',
      );
    return { reference, loaded: { status: 'ready', source: cached, text: workbookText(cached) } };
  }
  const response = await apiFetch(`/api/documents/${encodeURIComponent(reference.sourceId)}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error('This source is unavailable or you no longer have access.');
  const data = (await response.json()) as {
    document: WorkflowSourceDocument;
    downloadUrl: string | null;
  };
  assertSourceRevision(reference, data.document);
  if (data.document.status === 'uploading') throw new Error('This source upload is not complete.');
  if (reference.kind === 'workbook') {
    const source = await loadWorkflowSource(reference.sourceId, {
      selection: reference.workbookSelection,
      selectWorkbook,
    });
    // The second authenticated read must still refer to the captured revision.
    if (
      source.sourceRevision !== reference.sourceRevision ||
      (reference.contentHash && source.sourceContentHash !== reference.contentHash)
    )
      throw new Error(
        'The source changed while it was loading. Select its new revision explicitly.',
      );
    if (reference.fileHash && reference.fileHash !== source.contentHash)
      throw new Error('The source file changed. Select its new revision explicitly.');
    return {
      reference: {
        ...reference,
        fileHash: source.contentHash,
        workbookSelection: source.workbookSelection,
      },
      loaded: { status: 'ready', source, text: workbookText(source) },
    };
  }
  if (!data.downloadUrl) throw new Error('The original source file is unavailable.');
  if (data.document.sizeBytes && data.document.sizeBytes > 20 * 1024 * 1024)
    throw new Error('Use a source file smaller than 20 MB.');
  const download = await apiFetch(data.downloadUrl, { signal: AbortSignal.timeout(60000) });
  if (!download.ok) throw new Error('The source file could not be downloaded.');
  const file = new File([await download.blob()], reference.fileName, {
    type: reference.mimeType ?? 'application/octet-stream',
  });
  const hash = await fileHash(file);
  if (reference.fileHash && reference.fileHash !== hash)
    throw new Error('The source file changed. Select its new revision explicitly.');
  return {
    reference: { ...reference, fileHash: hash },
    loaded: { status: 'ready', text: await extractText(file) },
  };
}
export async function attachSavedChatSource(
  store: ContextStore,
  document: WorkflowSourceDocument,
  selectWorkbook?: SelectWorkbook,
) {
  if (store.get(chatContextLockedAtom))
    throw new Error('Wait for the current reply before changing context.');
  const epoch = store.get(chatContextEpochAtom);
  const result = await loadReference(sourceReference(document), store, selectWorkbook);
  await verifyLoadedReference(result.reference);
  assertChatContextCurrent(store, epoch);
  attachChatContextSource(store, result.reference, result.loaded, epoch);
}
export async function restoreChatSource(
  store: ContextStore,
  reference: ChatSourceReference,
  epoch: number,
) {
  if (store.get(chatContextEpochAtom) !== epoch) return;
  const fingerprint = JSON.stringify(reference);
  if (
    !store
      .get(chatContextAtom)
      .sources.some((item) => item.id === reference.id && JSON.stringify(item) === fingerprint)
  )
    return;
  const pending: LoadedChatSource = { status: 'loading' };
  store.set(loadedChatSourcesAtom, (previous) => ({ ...previous, [reference.id]: pending }));
  const stillSelected = () =>
    store.get(chatContextEpochAtom) === epoch &&
    store.get(loadedChatSourcesAtom)[reference.id] === pending &&
    store
      .get(chatContextAtom)
      .sources.some((item) => item.id === reference.id && JSON.stringify(item) === fingerprint);
  try {
    const result = await loadReference(reference, store);
    await verifyLoadedReference(result.reference);
    assertChatContextCurrent(store, epoch);
    if (!stillSelected()) return;
    // Restoring a secondary workbook must not change the selected workflow input.
    store.set(chatContextAtom, (previous) => ({
      ...previous,
      sources: previous.sources.map((item) => (item.id === reference.id ? result.reference : item)),
    }));
    store.set(loadedChatSourcesAtom, (previous) => ({
      ...previous,
      [reference.id]: result.loaded,
    }));
    syncChatSourceAdapters(store);
  } catch (error) {
    if (!stillSelected()) return;
    store.set(loadedChatSourcesAtom, (previous) => ({
      ...previous,
      [reference.id]: {
        status: 'unavailable',
        error: error instanceof Error ? error.message : 'The source is unavailable.',
      },
    }));
    syncChatSourceAdapters(store);
  }
}
export async function attachChatFile(
  store: ContextStore,
  file: File,
  selectWorkbook?: SelectWorkbook,
): Promise<string> {
  if (store.get(chatContextLockedAtom))
    throw new Error('Wait for the current reply before changing context.');
  if (file.size > 20 * 1024 * 1024) throw new Error('Use a source file smaller than 20 MB.');
  const epoch = store.get(chatContextEpochAtom);
  const hash = await fileHash(file);
  if (/\.(xlsx|xls|json)$/i.test(file.name)) {
    const { attachWorkflowSource } = await import('@/features/documents/attach-workflow-source');
    const { source, notice } = await attachWorkflowSource(file, selectWorkbook);
    assertChatContextCurrent(store, epoch);
    const reference: ChatSourceReference = {
      id: source.sourceId ?? crypto.randomUUID(),
      fileName: file.name,
      kind: 'workbook',
      sourceId: source.sourceId,
      sourceRevision: source.sourceRevision,
      contentHash: source.sourceContentHash,
      fileHash: hash,
      mimeType: file.type || null,
      workbookSelection: source.workbookSelection,
      notice,
    };
    attachChatContextSource(
      store,
      reference,
      { status: 'ready', source: { ...source, contentHash: hash }, text: workbookText(source) },
      epoch,
    );
    return `${file.name}: ${source.rows.length} source records. ${notice}`;
  }
  const text = await extractText(file);
  assertChatContextCurrent(store, epoch);
  const saved = await uploadDocument(file);
  assertChatContextCurrent(store, epoch);
  let reference: ChatSourceReference = {
    id: crypto.randomUUID(),
    fileName: file.name,
    kind: 'document',
    fileHash: hash,
    mimeType: file.type || null,
    localText: text,
    notice: `Local attachment; not saved in Sources. ${saved.error ?? ''}`.trim(),
  };
  if (saved.documentId) {
    const response = await apiFetch(`/api/documents/${encodeURIComponent(saved.documentId)}`, {
      signal: AbortSignal.timeout(30000),
    });
    assertChatContextCurrent(store, epoch);
    if (!response.ok)
      throw new Error(
        'The file was uploaded, but its source identity could not be verified. Select it from Sources when available.',
      );
    const data = (await response.json()) as { document: WorkflowSourceDocument };
    reference = { ...sourceReference(data.document), fileHash: hash, notice: 'Saved in Sources.' };
    assertSourceRevision(reference, data.document);
  }
  attachChatContextSource(store, reference, { status: 'ready', text }, epoch);
  return `${file.name}: ${text.text.length.toLocaleString()} characters${text.truncated ? ' (truncated)' : ''}. ${reference.notice}`;
}
