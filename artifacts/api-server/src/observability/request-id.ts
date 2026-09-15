import { randomUUID } from 'node:crypto';
import { isRequestId } from '@workspace/api-zod/observability';

type RequestIdFactory = () => string;

export function resolveRequestId(
  header: string | string[] | undefined,
  create: RequestIdFactory = randomUUID,
): string {
  const candidate = Array.isArray(header) ? undefined : header;
  return isRequestId(candidate) ? candidate : create();
}
