import { inflateRawSync } from 'node:zlib';
import { validateWorkflowLibrary } from '@workspace/workflow-contracts/library';
import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';

const PREFIX = 'taxflow-deflate-v1:';
const MAX_EXPANDED = 20_000_000;
/** Decode the existing portable format with explicit decompression/graph limits. */
export function decodeBackup(payload: string): WorkflowLibrary {
  let text = payload;
  if (payload.startsWith(PREFIX)) {
    const encoded = payload.slice(PREFIX.length);
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) throw new Error('Invalid compressed backup.');
    text = inflateRawSync(Buffer.from(encoded, 'base64'), {
      maxOutputLength: MAX_EXPANDED,
    }).toString('utf8');
  }
  if (text.length > MAX_EXPANDED) throw new Error('Expanded backup is too large.');
  const envelope: unknown = JSON.parse(text);
  if (
    !envelope ||
    typeof envelope !== 'object' ||
    !('format' in envelope) ||
    envelope.format !== 'taxflow-shared-json-v1'
  ) {
    return validateWorkflowLibrary(envelope);
  }
  if (
    !('nodes' in envelope) ||
    !Array.isArray(envelope.nodes) ||
    !('root' in envelope) ||
    envelope.nodes.length > 200000
  )
    throw new Error('Invalid shared backup.');
  const nodes: unknown[] = envelope.nodes;
  const active = new Set<number>();
  let visits = 0;
  function decode(value: unknown, depth = 0): unknown {
    if (++visits > 500000 || depth > 128) throw new Error('Backup graph exceeds its limits.');
    if (!Array.isArray(value)) {
      if (value !== null && !['string', 'boolean', 'number'].includes(typeof value))
        throw new Error('Invalid backup value.');
      return value;
    }
    const [id] = value;
    if (value.length !== 1 || !Number.isInteger(id) || id < 0 || active.has(id))
      throw new Error('Invalid backup reference.');
    const node = nodes[id];
    if (!Array.isArray(node) || node.length !== 2) throw new Error('Invalid backup node.');
    active.add(id);
    let result: unknown;
    if (node[0] === 'string' && typeof node[1] === 'string') result = node[1];
    else if (node[0] === 'array' && Array.isArray(node[1]))
      result = node[1].map((child) => decode(child, depth + 1));
    else if (node[0] === 'object' && Array.isArray(node[1]))
      result = Object.fromEntries(
        node[1].map((pair) => {
          if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== 'string')
            throw new Error('Invalid backup property.');
          return [pair[0], decode(pair[1], depth + 1)];
        }),
      );
    else throw new Error('Invalid backup node type.');
    active.delete(id);
    return result;
  }
  return validateWorkflowLibrary(decode(envelope.root));
}

export function validateBackup(payload: string): void {
  decodeBackup(payload);
}
