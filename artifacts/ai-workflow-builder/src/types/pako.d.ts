declare module 'pako' {
  export function deflateRaw(value: string, options: { to: 'string' }): string;
  export function inflateRaw(value: string, options: { to: 'string' }): string;
}
