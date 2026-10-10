import { inflateRawSync } from 'node:zlib';

export const MAX_SOURCE_ARCHIVE_BYTES = 64 * 1024 * 1024;
export const MAX_SOURCE_ARCHIVE_ENTRIES = 2048;
const invalid = (): never => {
  throw new Error(
    'This Office archive is unsupported, malformed or exceeds 64 MiB expanded / 2,048 entries. Save a smaller unencrypted file; nothing was captured.',
  );
};
function extras(bytes: Buffer, start: number, length: number) {
  const end = start + length;
  for (let offset = start; offset < end;) {
    if (offset + 4 > end) invalid();
    const type = bytes.readUInt16LE(offset);
    const size = bytes.readUInt16LE(offset + 2);
    // ZIP64 can override the bounded 32-bit lengths in either header.
    if (type === 1 || offset + 4 + size > end) invalid();
    offset += 4 + size;
  }
}

/** Bound ZIP expansion before XLSX/mammoth. No files are extracted to the filesystem. */
export function assertSourceArchiveBudget(input: Uint8Array): void {
  const bytes = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  let end = -1;
  for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65557); offset--) {
    if (
      bytes.readUInt32LE(offset) === 0x06054b50 &&
      offset + 22 + bytes.readUInt16LE(offset + 20) === bytes.length
    ) {
      end = offset;
      break;
    }
  }
  if (end < 0) {
    if (bytes.length >= 4 && [0x04034b50, 0x06054b50, 0x08074b50].includes(bytes.readUInt32LE(0)))
      invalid();
    return; // Legacy XLS, JSON and PDF remain owned by their existing parsers.
  }
  if (end >= 20 && bytes.readUInt32LE(end - 20) === 0x07064b50) invalid();
  const count = bytes.readUInt16LE(end + 10);
  const centralSize = bytes.readUInt32LE(end + 12);
  const centralStart = bytes.readUInt32LE(end + 16);
  if (
    bytes.readUInt16LE(end + 4) !== 0 ||
    bytes.readUInt16LE(end + 6) !== 0 ||
    bytes.readUInt16LE(end + 8) !== count ||
    count > MAX_SOURCE_ARCHIVE_ENTRIES ||
    centralStart === 0xffffffff ||
    centralSize === 0xffffffff ||
    centralStart + centralSize !== end
  )
    invalid();
  let cursor = centralStart;
  let expanded = 0;
  const names = new Set<string>();
  const ranges: { start: number; end: number }[] = [];
  for (let index = 0; index < count; index++) {
    if (cursor + 46 > end || bytes.readUInt32LE(cursor) !== 0x02014b50) invalid();
    const flags = bytes.readUInt16LE(cursor + 8);
    const method = bytes.readUInt16LE(cursor + 10);
    const compressed = bytes.readUInt32LE(cursor + 20);
    const uncompressed = bytes.readUInt32LE(cursor + 24);
    const nameSize = bytes.readUInt16LE(cursor + 28);
    const extraSize = bytes.readUInt16LE(cursor + 30);
    const commentSize = bytes.readUInt16LE(cursor + 32);
    const local = bytes.readUInt32LE(cursor + 42);
    const next = cursor + 46 + nameSize + extraSize + commentSize;
    if (
      flags & 0x2041 ||
      ![0, 8].includes(method) ||
      !nameSize ||
      next > end ||
      bytes.readUInt16LE(cursor + 34) !== 0 ||
      compressed === 0xffffffff ||
      uncompressed === 0xffffffff ||
      local === 0xffffffff ||
      uncompressed > MAX_SOURCE_ARCHIVE_BYTES - expanded
    )
      invalid();
    expanded += uncompressed;
    const name = bytes.subarray(cursor + 46, cursor + 46 + nameSize);
    const nameKey = name.toString('hex');
    if (names.has(nameKey)) invalid();
    names.add(nameKey);
    extras(bytes, cursor + 46 + nameSize, extraSize);
    if (local + 30 > centralStart || bytes.readUInt32LE(local) !== 0x04034b50) invalid();
    const localFlags = bytes.readUInt16LE(local + 6);
    const localMethod = bytes.readUInt16LE(local + 8);
    const localCompressed = bytes.readUInt32LE(local + 18);
    const localUncompressed = bytes.readUInt32LE(local + 22);
    const localNameSize = bytes.readUInt16LE(local + 26);
    const localExtraSize = bytes.readUInt16LE(local + 28);
    const dataStart = local + 30 + localNameSize + localExtraSize;
    if (
      localFlags !== flags ||
      localMethod !== method ||
      localNameSize !== nameSize ||
      dataStart + compressed > centralStart ||
      !bytes.subarray(local + 30, local + 30 + localNameSize).equals(name)
    )
      invalid();
    // Data-descriptor archives may use zero in local headers; nonzero sizes must
    // still match because SheetJS uses local lengths when allocating its inflater.
    if (
      (localCompressed !== compressed && (!(flags & 8) || localCompressed !== 0)) ||
      (localUncompressed !== uncompressed && (!(flags & 8) || localUncompressed !== 0))
    )
      invalid();
    extras(bytes, local + 30 + localNameSize, localExtraSize);
    let dataEnd = dataStart + compressed;
    if (flags & 8) {
      if (dataEnd + 12 > centralStart) invalid();
      const signature = bytes.readUInt32LE(dataEnd) === 0x08074b50 ? 4 : 0;
      if (
        dataEnd + signature + 12 > centralStart ||
        bytes.readUInt32LE(dataEnd + signature + 4) !== compressed ||
        bytes.readUInt32LE(dataEnd + signature + 8) !== uncompressed
      )
        invalid();
      dataEnd += signature + 12;
    }
    ranges.push({ start: local, end: dataEnd });
    const compressedBytes = bytes.subarray(dataStart, dataStart + compressed);
    if (method === 0) {
      if (compressed !== uncompressed) invalid();
    } else {
      try {
        const output = inflateRawSync(compressedBytes, {
          maxOutputLength: Math.max(1, uncompressed),
        });
        if (output.length !== uncompressed) invalid();
      } catch {
        invalid();
      }
    }
    cursor = next;
  }
  if (cursor !== centralStart + centralSize) invalid();
  ranges.sort((a, b) => a.start - b.start);
  if (ranges.some((range, index) => index > 0 && range.start < ranges[index - 1].end)) invalid();
}
