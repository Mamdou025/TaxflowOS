import { z } from 'zod';

export const WORKFLOW_LIBRARY_PATH = '/api/workflow-library';
export const WORKSPACE_HEADER = 'x-workflow-workspace';
export const RecoveryCodeSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const RevisionSchema = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
// The persistence endpoint stores an opaque, optionally compressed backup.
// The library decoder validates the graph and run contracts before applying it.
export const SaveLibraryRequestSchema = z.object({
  payload: z.string().max(20_000_000),
  revision: RevisionSchema,
});
export const SaveLibraryResponseSchema = z.object({
  revision: RevisionSchema,
  updated_at: z.string().optional(),
});
export const ReadLibraryResponseSchema = SaveLibraryResponseSchema.extend({
  payload: z.string().nullable(),
});
export type SaveLibraryRequest = z.infer<typeof SaveLibraryRequestSchema>;
export type SaveLibraryResponse = z.infer<typeof SaveLibraryResponseSchema>;
export type ReadLibraryResponse = z.infer<typeof ReadLibraryResponseSchema>;

export class WorkflowStorageError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'WorkflowStorageError';
  }
}

/** Shared wire contract; invalid responses never advance the client's revision. */
export function createWorkflowStorageClient(
  fetcher: typeof fetch = fetch,
  binding: {
    header: string;
    parse: (value: string) => string;
  } = { header: WORKSPACE_HEADER, parse: (value) => RecoveryCodeSchema.parse(value) },
) {
  async function request(
    method: string,
    code: string,
    body?: SaveLibraryRequest,
  ): Promise<unknown> {
    const response = await fetcher(WORKFLOW_LIBRARY_PATH, {
      method,
      headers: {
        'Content-Type': 'application/json',
        [binding.header]: binding.parse(code),
      },
      body: body === undefined ? undefined : JSON.stringify(SaveLibraryRequestSchema.parse(body)),
      signal: AbortSignal.timeout(20_000),
    });
    const result: unknown = await response.json();
    if (!response.ok) {
      const parsed = z.object({ error: z.string() }).safeParse(result);
      throw new WorkflowStorageError(
        parsed.success ? parsed.data.error : 'Server save unavailable. Retry or export a backup.',
        response.status,
      );
    }
    return result;
  }
  return {
    async read(code: string): Promise<ReadLibraryResponse> {
      return ReadLibraryResponseSchema.parse(await request('GET', code));
    },
    async save(code: string, body: SaveLibraryRequest): Promise<SaveLibraryResponse> {
      return SaveLibraryResponseSchema.parse(await request('PUT', code, body));
    },
  };
}
