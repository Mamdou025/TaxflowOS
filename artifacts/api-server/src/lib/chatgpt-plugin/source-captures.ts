import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { pool } from '@workspace/db';
import { z } from 'zod';
import { getSession, sessionDefinition } from '@workspace/workflow-core/sessions';
import { DocumentExtractionSchema } from '@workspace/workflow-contracts/generated-schemas';
import type { DocumentExtraction } from '@workspace/workflow-contracts/domain/document-extraction';
import { decodeBackup } from '../../storage/validate-backup';
import { inspectSourceFile, parseSourceFile } from './source-parser';
import { preserveSourceOriginal } from './source-original';

const id = z.string().min(1).max(200);
const selection = z
  .object({
    sheetName: id,
    headerRowNumber: z.number().int().min(1).max(50000),
    currency: z.string().max(10).optional(),
    mapping: z
      .object({
        account: id.optional(),
        label: id.optional(),
        description: id.optional(),
        amount: id.optional(),
        currency: id.optional(),
        debit: id.optional(),
        credit: id.optional(),
        accountType: id.optional(),
      })
      .strict(),
  })
  .strict();
export const sourceToolSchemas = {
  begin_workflow_source: z
    .object({
      workflowId: id,
      runId: id,
      blockId: id,
      expectedRevision: z.number().int().nonnegative(),
      fileName: z
        .string()
        .min(1)
        .max(500)
        .regex(/\.(xlsx|xls|json|pdf|docx)$/i),
      size: z
        .number()
        .int()
        .min(1)
        .max(20 * 1024 * 1024),
      mimeType: z.string().max(200),
    })
    .strict(),
  append_workflow_source: z
    .object({
      uploadId: id,
      offset: z.number().int().nonnegative(),
      base64: z.string().min(4).max(65536),
    })
    .strict(),
  inspect_workflow_source: z
    .object({
      uploadId: id,
      sheetName: id.optional(),
      headerRowNumber: z.number().int().min(1).max(50000).optional(),
    })
    .strict(),
  capture_workflow_source: z.object({ uploadId: id, selection: selection.optional() }).strict(),
};
export const SOURCE_CHUNK_BYTES = 49152;
type Actor = { userId: string; workspaceId: string };
const connect = () => pool.connect();
type Client = Awaited<ReturnType<typeof connect>>;
type Capture = {
  id: string;
  actor_id: string;
  workspace_id: string;
  workflow_id: string;
  run_id: string;
  block_id: string;
  session_revision: number;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_bytes: number;
  content_base64: string;
  extraction: DocumentExtraction | null;
  selection: unknown;
};

export class SourceCaptureError extends Error {}
const fail = (message: string): never => {
  throw new SourceCaptureError(message);
};
async function parseFileData<T>(parse: () => Promise<T>) {
  try {
    return await parse();
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    return fail(
      /^(?:Use |Choose |Select |This |Row |Column |No |The selected |The worksheet |Upload )/.test(
        message,
      )
        ? message.replace(/[\r\n\x00-\x1f]/g, ' ').slice(0, 500)
        : 'This file could not be read. Check its format and contents; the active source was preserved.',
    );
  }
}

/** Each step rechecks current role under the same transaction as its capture write. */
async function transaction<T>(actor: Actor, work: (client: Client) => Promise<T>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const member = await client.query(
      'SELECT role FROM workspace_members WHERE workspace_id=$1 AND user_id=$2 FOR SHARE',
      [actor.workspaceId, actor.userId],
    );
    if (!['owner', 'editor'].includes(member.rows[0]?.role))
      fail('Current Owner or Editor membership is required to upload evidence.');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function loadCapture(client: Client, actor: Actor, captureId: string) {
  const { rows } = await client.query<Capture>(
    'SELECT * FROM chatgpt_source_captures WHERE id=$1 AND actor_id=$2 AND workspace_id=$3 AND expires_at>now() FOR UPDATE',
    [captureId, actor.userId, actor.workspaceId],
  );
  return (
    rows[0] ??
    fail(
      'This staged upload is unavailable or expired. Select the file again; the active source is unchanged.',
    )
  );
}
function completeBytes(row: Capture) {
  if (row.uploaded_bytes !== row.size_bytes)
    fail('Upload is incomplete; the active source is unchanged.');
  if (row.extraction)
    fail('This upload was already captured. Start a new upload to change the sheet selection.');
  const bytes = Buffer.from(row.content_base64, 'base64');
  if (bytes.length !== row.size_bytes) fail('The uploaded bytes could not be verified.');
  return bytes;
}

export async function runSourceTool(
  actor: Actor,
  name: keyof typeof sourceToolSchemas,
  input: unknown,
) {
  if (name === 'begin_workflow_source') {
    const value = sourceToolSchemas[name].parse(input);
    return transaction(actor, async (client) => {
      await client.query(
        'DELETE FROM chatgpt_source_captures WHERE actor_id=$1 AND expires_at<=now()',
        [actor.userId],
      );
      const count = await client.query(
        'SELECT count(*)::int AS count FROM chatgpt_source_captures WHERE actor_id=$1 AND extraction IS NULL',
        [actor.userId],
      );
      if (count.rows[0].count >= 4)
        fail(
          'Four uploads are already staged. Finish one or wait for the one-hour staging expiry.',
        );
      const saved = await client.query(
        'SELECT payload FROM workspace_libraries WHERE workspace_id=$1',
        [actor.workspaceId],
      );
      const library = saved.rows[0] ? decodeBackup(saved.rows[0].payload) : {};
      const entry = Object.hasOwn(library, value.workflowId)
        ? library[value.workflowId]
        : undefined;
      if (!entry) return fail('The exact workflow is unavailable.');
      const session = getSession(entry, value.runId);
      if (session.revision !== value.expectedRevision || !session.paused || session.endedAt)
        fail('The working run changed or cannot accept edits. Refresh before uploading.');
      const block = sessionDefinition(entry, session).blocks.find(
        (block) => block.id === value.blockId,
      );
      if (
        !block ||
        block.family !== 'Source' ||
        !/excel|workbook|uploaded|manual_table|pdf_document/i.test(
          `${block.subtype} ${block.config.sourceKind} ${block.config.toolId}`,
        )
      )
        fail('Select a document source block.');
      const uploadId = randomUUID();
      await client.query(
        `INSERT INTO chatgpt_source_captures(id,actor_id,workspace_id,workflow_id,run_id,block_id,session_revision,file_name,mime_type,size_bytes,expires_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now()+interval '1 hour')`,
        [
          uploadId,
          actor.userId,
          actor.workspaceId,
          value.workflowId,
          value.runId,
          value.blockId,
          value.expectedRevision,
          value.fileName,
          value.mimeType,
          value.size,
        ],
      );
      return { uploadId, chunkBytes: SOURCE_CHUNK_BYTES };
    });
  }
  if (name === 'append_workflow_source') {
    const value = sourceToolSchemas[name].parse(input);
    const bytes = Buffer.from(value.base64, 'base64');
    if (
      bytes.toString('base64') !== value.base64 ||
      !bytes.length ||
      bytes.length > SOURCE_CHUNK_BYTES
    )
      fail('Invalid upload chunk.');
    return transaction(actor, async (client) => {
      const row = await loadCapture(client, actor, value.uploadId);
      if (row.extraction) fail('This source was already captured.');
      if (value.offset < row.uploaded_bytes) {
        const prior = Buffer.from(row.content_base64, 'base64').subarray(
          value.offset,
          value.offset + bytes.length,
        );
        if (!prior.equals(bytes))
          fail('A retry contains different file bytes. Start a new upload.');
        return { offset: row.uploaded_bytes };
      }
      const offset = value.offset + bytes.length;
      if (
        value.offset !== row.uploaded_bytes ||
        offset > row.size_bytes ||
        (offset < row.size_bytes && bytes.length !== SOURCE_CHUNK_BYTES)
      )
        fail('Upload chunk is out of order or too large.');
      await client.query(
        'UPDATE chatgpt_source_captures SET content_base64=content_base64||$2,uploaded_bytes=$3 WHERE id=$1',
        [row.id, value.base64, offset],
      );
      return { offset };
    });
  }
  if (name === 'inspect_workflow_source') {
    const value = sourceToolSchemas[name].parse(input);
    return transaction(actor, async (client) => {
      const row = await loadCapture(client, actor, value.uploadId);
      return {
        uploadId: row.id,
        ...(await parseFileData(() => inspectSourceFile(completeBytes(row), row.file_name, value))),
      };
    });
  }
  const value = sourceToolSchemas.capture_workflow_source.parse(input);
  return transaction(actor, async (client) => {
    const row = await loadCapture(client, actor, value.uploadId);
    if (row.extraction && !isDeepStrictEqual(row.selection, value.selection ?? null))
      fail('This file was already captured with a different selection. Start a new upload.');
    let extraction = row.extraction;
    if (!extraction) {
      const bytes = completeBytes(row);
      extraction = await parseFileData(() =>
        parseSourceFile(bytes, row.file_name, value.selection),
      );
      await preserveSourceOriginal(actor, row.id, bytes, row.file_name, row.mime_type, extraction);
      extraction = DocumentExtractionSchema.parse(extraction);
      await client.query(
        "UPDATE chatgpt_source_captures SET extraction=$2,selection=$3,content_base64='' WHERE id=$1",
        [row.id, JSON.stringify(extraction), JSON.stringify(value.selection ?? null)],
      );
    }
    return {
      captureId: row.id,
      fileName: row.file_name,
      rowCount: extraction.rows.length,
      previewRows: extraction.rows.slice(0, 10),
      issues: extraction.issues,
    };
  });
}

export async function resolveSourceCapture(actor: Actor, captureId: string) {
  return transaction(actor, async (client) => {
    const row = await loadCapture(client, actor, captureId);
    if (!row.extraction) return fail('This source has not been captured.');
    const extraction = DocumentExtractionSchema.parse(row.extraction);
    return {
      id: row.id,
      workflowId: row.workflow_id,
      runId: row.run_id,
      blockId: row.block_id,
      name: row.file_name,
      rows: extraction.rows,
      extraction,
    };
  });
}
