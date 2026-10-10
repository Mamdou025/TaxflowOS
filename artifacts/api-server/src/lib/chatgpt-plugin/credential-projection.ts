// Adapter-only disclosure filter. Credentials belong in server connection storage,
// never workflow definitions; this also handles credential-shaped legacy fields.
// configSignature can contain JSON.stringify(config), so it is not a safe hash.
const credentialKey =
  /^(?:configSignature|key|auth|authorization|authentication|bearer|headers|cookie|cookies|set-cookie|passwd|pwd|database[-_]?url|connection[-_]?string)$|api[-_]?key|token|secret|password|credential|private[-_]?key/i;

export function projectCredentialFields(input: Record<string, unknown>) {
  let fieldsOmitted = false;
  function project(value: unknown, depth: number, collection: string): unknown {
    if (depth > 256) throw new Error('Workflow disclosure nesting exceeds the projection limit.');
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.map((item) => project(item, depth + 1, collection));
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value)
          .filter(([key]) => {
            // These contract fields identify worksheet values, not credentials.
            if (key === 'key' && (collection === 'fields' || collection === 'dependencies'))
              return true;
            // Worksheet column titles are user-visible data, not HTTP headers.
            if (key === 'headers' && collection === 'sheets') return true;
            if (!credentialKey.test(key)) return true;
            fieldsOmitted = true;
            return false;
          })
          .map(([key, item]) => [key, project(item, depth + 1, key)]),
      );
    }
    return value;
  }
  const value = Object.fromEntries(
    Object.entries(input).map(([key, item]) => [key, project(item, 0, key)]),
  );
  return { value, fieldsOmitted };
}
