import { pool } from '@workspace/db';

const connect = () => pool.connect();
export type Client = Awaited<ReturnType<typeof connect>>;
export type Scope = { actorId: string; workspaceId: string };
export type WorkerScope = Scope & { workerId: string };
export class MkoroError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
export function iso(value: unknown): string {
  return value instanceof Date ? value.toISOString() : String(value);
}
export async function transaction<T>(run: (client: Client) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await run(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
export const activeStatuses = ['queued', 'running', 'waiting_permission'];
