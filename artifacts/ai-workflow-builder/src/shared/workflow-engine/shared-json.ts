// Lossless JSON storage with repeated objects stored once. Run records contain
// many copies of the same upstream rows in outputs, transfer snapshots and logs.
// The envelope is storage-only; readers still receive the complete JSON value.
type Encoded = null | boolean | number | string | [number];
type Node = ['array', Encoded[]] | ['object', [string, Encoded][]] | ['string', string];
const FORMAT = 'taxflow-shared-json-v1';
const COMPRESSED_PREFIX = 'taxflow-deflate-v1:';

export function stringifySharedJSON(value: unknown): string {
  const nodes: Node[] = [];
  const signatures = new Map<string, number>();
  const identities = new WeakMap<object, number>();
  const visiting = new WeakSet<object>();
  const encode = (input: unknown): Encoded => {
    if (input == null) return null;
    if (typeof input === 'string' && input.length > 64) {
      const signature = `string:${input}`;
      let index = signatures.get(signature);
      if (index === undefined) {
        index = nodes.length;
        signatures.set(signature, index);
        nodes.push(['string', input]);
      }
      return [index];
    }
    if (typeof input === 'string' || typeof input === 'boolean') return input;
    if (typeof input === 'number') return Number.isFinite(input) ? input : null;
    if (input instanceof Date) return input.toJSON();
    if (typeof input !== 'object') throw new TypeError('Unsupported JSON value');
    const previous = identities.get(input);
    if (previous !== undefined) return [previous];
    if (visiting.has(input)) throw new TypeError('Circular JSON value');
    visiting.add(input);
    const node: Node = Array.isArray(input)
      ? ['array', input.map(encode)]
      : ['object', Object.entries(input).filter(([, item]) => item !== undefined).map(([key, item]) => [key, encode(item)])];
    const signature = JSON.stringify(node);
    let index = signatures.get(signature);
    if (index === undefined) {
      index = nodes.length;
      signatures.set(signature, index);
      nodes.push(node);
    }
    visiting.delete(input);
    identities.set(input, index);
    return [index];
  };
  const root = encode(value);
  const text = JSON.stringify({ format: FORMAT, root, nodes });
  return text.length > 2048 ? COMPRESSED_PREFIX + btoa(deflateRaw(text, { to: 'string' })) : text;
}

export function parseSharedJSON(text: string): unknown {
  const envelope = JSON.parse(text.startsWith(COMPRESSED_PREFIX)
    ? inflateRaw(atob(text.slice(COMPRESSED_PREFIX.length)), { to: 'string' }) : text);
  if (envelope?.format !== FORMAT) return envelope; // Existing uncompressed saves.
  const nodes: Node[] = envelope.nodes;
  const cache = new Map<number, unknown>();
  const decode = (value: Encoded): unknown => {
    if (!Array.isArray(value)) return value;
    const index = value[0];
    if (cache.has(index)) return cache.get(index);
    const node = nodes[index];
    if (!node) throw new Error('Invalid workflow storage reference');
    const result = node[0] === 'string' ? node[1] : node[0] === 'array'
      ? node[1].map(decode)
      : Object.fromEntries(node[1].map(([key, child]) => [key, decode(child)]));
    cache.set(index, result);
    return result;
  };
  return decode(envelope.root);
}

export function sharedJSONStorage<T>() {
  return {
    getItem(key: string, initialValue: T): T {
      if (typeof window === 'undefined') return initialValue;
      const value = window.localStorage.getItem(key);
      return value === null ? initialValue : parseSharedJSON(value) as T;
    },
    setItem(key: string, value: T) {
      window.localStorage.setItem(key, stringifySharedJSON(value));
    },
    removeItem(key: string) { window.localStorage.removeItem(key); },
    subscribe(key: string, callback: (value: T) => void, initialValue: T) {
      const listener = (event: StorageEvent) => {
        if (event.storageArea === window.localStorage && event.key === key) {
          callback(event.newValue === null ? initialValue : parseSharedJSON(event.newValue) as T);
        }
      };
      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    },
  };
}
import { deflateRaw, inflateRaw } from 'pako';
