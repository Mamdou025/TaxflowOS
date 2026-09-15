export const REQUEST_ID_HEADER = 'x-request-id';

const REQUEST_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

/** Request IDs are correlation data only; they never establish identity or authority. */
export function isRequestId(value: unknown): value is string {
  return typeof value === 'string' && REQUEST_ID_PATTERN.test(value);
}
