import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { deflateRawSync } from 'node:zlib';
import {
  assertSourceArchiveBudget,
  MAX_SOURCE_ARCHIVE_BYTES,
  MAX_SOURCE_ARCHIVE_ENTRIES,
} from '../../artifacts/api-server/src/lib/chatgpt-plugin/source-archive-budget';

function zip(
  entries: {
    name: string;
    data: Buffer;
    method?: number;
    flags?: number;
    declaredSize?: number;
    localSize?: number;
    extra?: Buffer;
  }[],
) {
  const locals: Buffer[] = [],
    central: Buffer[] = [];
  let offset = 0;
  for (const entry of entries) {
    const method = entry.method ?? 8,
      flags = entry.flags ?? 0;
    const payload = method === 8 ? deflateRawSync(entry.data) : entry.data;
    const size = entry.declaredSize ?? entry.data.length;
    const name = Buffer.from(entry.name),
      extra = entry.extra ?? Buffer.alloc(0);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(flags, 6);
    header.writeUInt16LE(method, 8);
    header.writeUInt32LE(flags & 8 ? 0 : payload.length, 18);
    header.writeUInt32LE(entry.localSize ?? (flags & 8 ? 0 : size), 22);
    header.writeUInt16LE(name.length, 26);
    header.writeUInt16LE(extra.length, 28);
    const descriptor = flags & 8 ? Buffer.alloc(16) : Buffer.alloc(0);
    if (descriptor.length) {
      descriptor.writeUInt32LE(0x08074b50);
      descriptor.writeUInt32LE(payload.length, 8);
      descriptor.writeUInt32LE(size, 12);
    }
    const local = Buffer.concat([header, name, extra, payload, descriptor]);
    const index = Buffer.alloc(46);
    index.writeUInt32LE(0x02014b50);
    index.writeUInt16LE(20, 6);
    index.writeUInt16LE(flags, 8);
    index.writeUInt16LE(method, 10);
    index.writeUInt32LE(payload.length, 20);
    index.writeUInt32LE(size, 24);
    index.writeUInt16LE(name.length, 28);
    index.writeUInt16LE(extra.length, 30);
    index.writeUInt32LE(offset, 42);
    locals.push(local);
    central.push(Buffer.concat([index, name, extra]));
    offset += local.length;
  }
  const directory = Buffer.concat(central),
    end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, directory, end]);
}

test('archive budget accepts real XLSX, stored/deflated entries and data descriptors, and leaves nonarchives to their parser', () => {
  const XLSX = createRequire(new URL('../../artifacts/api-server/package.json', import.meta.url))(
    'xlsx',
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['Account', 'Amount'],
      ['Cash', 12],
    ]),
    'Trial balance',
  );
  assert.doesNotThrow(() =>
    assertSourceArchiveBudget(
      XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx', compression: true }),
    ),
  );
  for (const method of [0, 8])
    for (const flags of [0, 8])
      assert.doesNotThrow(() =>
        assertSourceArchiveBudget(
          zip([
            {
              name: 'word/document.xml',
              data: Buffer.from('<document>Example</document>'),
              method,
              flags,
            },
          ]),
        ),
      );
  for (const data of [Buffer.from('%PDF-1.7'), Buffer.from('[{"amount":1}]'), Buffer.alloc(0)])
    assert.doesNotThrow(() => assertSourceArchiveBudget(data));
});

test('archive budget rejects actual expansion larger than declared and misleading local allocation sizes', () => {
  assert.throws(
    () =>
      assertSourceArchiveBudget(
        zip([
          { name: 'xl/sharedStrings.xml', data: Buffer.alloc(1024 * 1024, 65), declaredSize: 10 },
        ]),
      ),
    /archive/,
  );
  assert.throws(
    () =>
      assertSourceArchiveBudget(
        zip([
          { name: 'xl/sharedStrings.xml', data: Buffer.from('bounded'), localSize: 0x7fffffff },
        ]),
      ),
    /archive/,
  );
  assert.throws(
    () =>
      assertSourceArchiveBudget(
        zip([
          {
            name: 'xl/sharedStrings.xml',
            data: Buffer.from('bounded'),
            flags: 8,
            localSize: 0x7fffffff,
          },
        ]),
      ),
    /archive/,
  );
});

test('archive budget rejects expanded totals and entry counts before Office parsing', () => {
  assert.throws(
    () =>
      assertSourceArchiveBudget(
        zip([
          { name: 'huge.xml', data: Buffer.alloc(0), declaredSize: MAX_SOURCE_ARCHIVE_BYTES + 1 },
        ]),
      ),
    /archive/,
  );
  assert.throws(
    () =>
      assertSourceArchiveBudget(
        zip(
          Array.from({ length: MAX_SOURCE_ARCHIVE_ENTRIES + 1 }, (_, index) => ({
            name: `part-${index}.xml`,
            data: Buffer.alloc(0),
          })),
        ),
      ),
    /archive/,
  );
  const half = Buffer.alloc(MAX_SOURCE_ARCHIVE_BYTES / 2 + 1, 65);
  const oversized = zip([
    { name: 'one.xml', data: half },
    { name: 'two.xml', data: half },
  ]);
  assert.throws(() => assertSourceArchiveBudget(oversized), /archive/);
});

test('archive budget rejects encryption, ZIP64, unsupported compression, truncated and duplicate entries', () => {
  for (const flags of [1, 0x40, 0x2000])
    assert.throws(
      () =>
        assertSourceArchiveBudget(zip([{ name: 'part.xml', data: Buffer.from('data'), flags }])),
      /archive/,
    );
  assert.throws(
    () =>
      assertSourceArchiveBudget(zip([{ name: 'part.xml', data: Buffer.from('data'), method: 12 }])),
    /archive/,
  );
  const extra = Buffer.alloc(4);
  extra.writeUInt16LE(1, 0);
  assert.throws(
    () => assertSourceArchiveBudget(zip([{ name: 'part.xml', data: Buffer.from('data'), extra }])),
    /archive/,
  );
  const valid = zip([{ name: 'part.xml', data: Buffer.from('data') }]);
  assert.throws(() => assertSourceArchiveBudget(valid.subarray(0, valid.length - 1)), /archive/);
  assert.throws(
    () =>
      assertSourceArchiveBudget(
        zip([
          { name: 'same.xml', data: Buffer.from('one') },
          { name: 'same.xml', data: Buffer.from('two') },
        ]),
      ),
    /archive/,
  );
});
