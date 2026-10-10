import type { WorkbookSelection } from '@workspace/source-connectors/workbook-upload';
import type { ProjectedMessage } from './message-codec';
import { parseWorkflowInteraction, type WorkflowInteraction } from './workflow-interaction';

export const CHAT_TEXT_LIMIT = 120_000;
export type ChatTextSnapshot = {
  text: string;
  kind: 'pdf' | 'word' | 'text' | 'excel';
  truncated: boolean;
  pages?: number;
};
export type ChatSourceReference = {
  id: string;
  fileName: string;
  kind: 'document' | 'workbook';
  sourceId?: string;
  sourceRevision?: number;
  /** Source content hashes describe extracted text; file hashes describe original bytes. */
  contentHash?: string | null;
  fileHash?: string;
  mimeType?: string | null;
  workbookSelection?: WorkbookSelection;
  /** Only local, unsaved attachments keep a bounded text snapshot in chat history. */
  localText?: ChatTextSnapshot;
  notice?: string;
};
export type ChatContext = {
  version: 1;
  companyName: string;
  year: number | null;
  sources: ChatSourceReference[];
  workflowSourceId: string | null;
  workflowScope: { id: string; name: string } | null;
  workflowInteraction?: WorkflowInteraction | null;
};
export function emptyChatContext(): ChatContext {
  return {
    version: 1,
    companyName: '',
    year: null,
    sources: [],
    workflowSourceId: null,
    workflowScope: null,
  };
}
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown, max = 1000): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const positiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

/** Restore data only. No file fetch, source substitution or workflow action occurs here. */
export function parseChatContext(value: unknown): ChatContext {
  if (
    !record(value) ||
    value.version !== 1 ||
    typeof value.companyName !== 'string' ||
    value.companyName.length > 200 ||
    (value.year !== null &&
      (typeof value.year !== 'number' ||
        !Number.isInteger(value.year) ||
        value.year < 1900 ||
        value.year > 3000)) ||
    !Array.isArray(value.sources) ||
    value.sources.length > 100
  )
    throw new Error('This saved chat has invalid context. No other context was selected.');
  const sources = value.sources.map((item): ChatSourceReference => {
    if (
      !record(item) ||
      !text(item.id, 200) ||
      !text(item.fileName, 500) ||
      typeof item.kind !== 'string' ||
      !['document', 'workbook'].includes(item.kind) ||
      (item.sourceId !== undefined &&
        (!text(item.sourceId, 200) || !positiveInteger(item.sourceRevision))) ||
      (item.sourceId === undefined && item.sourceRevision !== undefined) ||
      (item.contentHash != null && !text(item.contentHash, 200)) ||
      (item.fileHash !== undefined && !text(item.fileHash, 200)) ||
      (item.mimeType != null && !text(item.mimeType, 200)) ||
      (item.notice !== undefined && !text(item.notice, 2000))
    )
      throw new Error('A saved chat source reference is invalid. Reattach the intended source.');
    let workbookSelection: WorkbookSelection | undefined;
    if (item.workbookSelection !== undefined) {
      const selection = item.workbookSelection;
      if (
        !record(selection) ||
        !text(selection.sheetName, 500) ||
        (selection.headerRowNumber !== undefined && !positiveInteger(selection.headerRowNumber)) ||
        (selection.currency !== undefined && typeof selection.currency !== 'string') ||
        (selection.mapping !== undefined &&
          (!record(selection.mapping) ||
            Object.entries(selection.mapping).some(
              ([key, column]) =>
                ![
                  'account',
                  'accountType',
                  'label',
                  'description',
                  'amount',
                  'debit',
                  'credit',
                  'currency',
                ].includes(key) ||
                (column !== undefined && typeof column !== 'string'),
            )))
      )
        throw new Error(
          'The saved workbook selection is invalid. Choose its sheet and columns again.',
        );
      workbookSelection = structuredClone(selection) as WorkbookSelection;
    }
    let localText: ChatTextSnapshot | undefined;
    if (item.localText !== undefined) {
      const snapshot = item.localText;
      if (
        item.sourceId !== undefined ||
        !record(snapshot) ||
        typeof snapshot.text !== 'string' ||
        snapshot.text.length > CHAT_TEXT_LIMIT ||
        typeof snapshot.truncated !== 'boolean' ||
        typeof snapshot.kind !== 'string' ||
        !['pdf', 'word', 'text', 'excel'].includes(snapshot.kind) ||
        (snapshot.pages !== undefined && !positiveInteger(snapshot.pages))
      )
        throw new Error('The saved local attachment snapshot is invalid.');
      localText = structuredClone(snapshot) as ChatTextSnapshot;
    }
    return {
      id: item.id,
      fileName: item.fileName,
      kind: item.kind as ChatSourceReference['kind'],
      ...(item.sourceId !== undefined
        ? { sourceId: item.sourceId as string, sourceRevision: item.sourceRevision as number }
        : {}),
      ...(item.contentHash !== undefined ? { contentHash: item.contentHash as string | null } : {}),
      ...(item.fileHash !== undefined ? { fileHash: item.fileHash as string } : {}),
      ...(item.mimeType !== undefined ? { mimeType: item.mimeType as string | null } : {}),
      ...(item.notice !== undefined ? { notice: item.notice as string } : {}),
      ...(workbookSelection ? { workbookSelection } : {}),
      ...(localText ? { localText } : {}),
    };
  });
  if (
    sources.reduce((total, source) => total + (source.localText?.text.length ?? 0), 0) >
    CHAT_TEXT_LIMIT
  )
    throw new Error(
      'Local text attachments exceed the saved chat limit. Remove a local attachment or save sources before adding more.',
    );
  if (
    new Set(sources.map((source) => source.id)).size !== sources.length ||
    (value.workflowSourceId !== null &&
      !sources.some((source) => source.id === value.workflowSourceId && source.kind === 'workbook'))
  )
    throw new Error('The saved chat source selection is invalid.');
  const scope = value.workflowScope;
  if (scope !== null && (!record(scope) || !text(scope.id, 200) || !text(scope.name)))
    throw new Error('The saved workflow context is invalid.');
  return {
    version: 1,
    companyName: value.companyName,
    year: value.year as number | null,
    sources,
    workflowSourceId: value.workflowSourceId as string | null,
    workflowScope: scope ? { id: scope.id as string, name: scope.name as string } : null,
    workflowInteraction: parseWorkflowInteraction(value.workflowInteraction),
  };
}
export function hasChatContext(value: ChatContext) {
  return !!(
    value.companyName ||
    value.year !== null ||
    value.sources.length ||
    value.workflowScope ||
    value.workflowInteraction
  );
}
export function withChatContext(
  messages: ProjectedMessage[],
  threadId: string,
  context: ChatContext,
): ProjectedMessage[] {
  return [
    {
      id: `${threadId}:chat-context`,
      role: 'system',
      seq: 0,
      content: { chatContext: parseChatContext(context) },
    },
    ...messages.map((message, index) => ({ ...message, seq: index + 1 })),
  ];
}
export function readChatContext(messages: { content: unknown }[]): ChatContext {
  const row = messages.find(
    (message) => record(message.content) && 'chatContext' in message.content,
  );
  return row && record(row.content)
    ? parseChatContext(row.content.chatContext)
    : emptyChatContext();
}
export function assertSourceRevision(
  reference: ChatSourceReference,
  document: {
    id: string;
    sourceRevision: number;
    contentHash?: string | null;
    lifecycleStatus: string;
  },
) {
  if (
    document.lifecycleStatus !== 'active' ||
    document.id !== reference.sourceId ||
    document.sourceRevision !== reference.sourceRevision ||
    (reference.contentHash && document.contentHash !== reference.contentHash)
  )
    throw new Error(
      'This source changed or is unavailable. Its saved revision was not replaced. Remove it and select the intended source again.',
    );
}
