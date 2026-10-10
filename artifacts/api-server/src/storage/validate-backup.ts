import { inflateRawSync } from 'node:zlib';
import { validateWorkflowLibrary } from '@workspace/workflow-contracts/library';
import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';
import { assertBackupSchemaBudget } from './backup-schema-budget';

const PREFIX = 'taxflow-deflate-v1:';
const MAX_EXPANDED = 20_000_000;
const MAX_LOGICAL_JSON_BYTES = 256 * 1024 * 1024;
type DecodedNode = { value: unknown; height: number; jsonBytes: number };

function addLogicalBytes(total: number, extra: number) {
  if (extra > MAX_LOGICAL_JSON_BYTES - total)
    throw new Error('Backup logical expansion exceeds its limits.');
  return total + extra;
}
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
    assertBackupSchemaBudget(envelope);
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
  const cache = new Map<number, DecodedNode>();
  let visits = 0;
  function decode(value: unknown, depth = 0): DecodedNode {
    if (++visits > 500000 || depth > 128) throw new Error('Backup graph exceeds its limits.');
    if (!Array.isArray(value)) {
      if (value !== null && !['string', 'boolean', 'number'].includes(typeof value))
        throw new Error('Invalid backup value.');
      return { value, height: 0, jsonBytes: Buffer.byteLength(JSON.stringify(value)) };
    }
    const [id] = value;
    if (value.length !== 1 || !Number.isInteger(id) || id < 0 || active.has(id))
      throw new Error('Invalid backup reference.');
    const prior = cache.get(id);
    if (prior) {
      if (depth + prior.height > 128) throw new Error('Backup graph exceeds its limits.');
      return prior;
    }
    const node = nodes[id];
    if (!Array.isArray(node) || node.length !== 2) throw new Error('Invalid backup node.');
    active.add(id);
    let result: unknown;
    let height = 0;
    let jsonBytes = 0;
    const childValue = (child: unknown) => {
      const decoded = decode(child, depth + 1);
      height = Math.max(height, decoded.height + 1);
      return decoded;
    };
    if (node[0] === 'string' && typeof node[1] === 'string') {
      result = node[1];
      jsonBytes = Buffer.byteLength(JSON.stringify(result));
    } else if (node[0] === 'array' && Array.isArray(node[1])) {
      jsonBytes = 2;
      result = node[1].map((child, index) => {
        const decoded = childValue(child);
        jsonBytes = addLogicalBytes(jsonBytes, decoded.jsonBytes + (index ? 1 : 0));
        return decoded.value;
      });
    } else if (node[0] === 'object' && Array.isArray(node[1])) {
      const properties = new Map<string, DecodedNode>();
      for (const pair of node[1]) {
        if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== 'string')
          throw new Error('Invalid backup property.');
        properties.set(pair[0], childValue(pair[1]));
      }
      jsonBytes = 2;
      const entries = [...properties].map(([key, decoded], index) => {
        jsonBytes = addLogicalBytes(
          jsonBytes,
          Buffer.byteLength(JSON.stringify(key)) + 1 + decoded.jsonBytes + (index ? 1 : 0),
        );
        return [key, decoded.value];
      });
      result = Object.fromEntries(entries);
    } else throw new Error('Invalid backup node type.');
    active.delete(id);
    const decoded = { value: result, height, jsonBytes };
    cache.set(id, decoded);
    return decoded;
  }
  const decoded = decode(envelope.root).value;
  assertBackupSchemaBudget(decoded);
  return validateWorkflowLibrary(decoded);
}

export function validateBackup(payload: string): void {
  decodeBackup(payload);
}
