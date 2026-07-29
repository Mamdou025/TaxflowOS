// ─────────────────────────────────────────────────────────────────────────────
// Chunking — split a document's text into overlapping windows for embedding.
// A sliding window of ~800 tokens with ~100 tokens of overlap, snapped to a
// nearby paragraph/sentence/space boundary so chunks read cleanly. Token counts
// are estimated at ~4 chars/token (good enough for sizing; not billed).
// Ported from the web app's platform/rag/chunk.ts.
// ─────────────────────────────────────────────────────────────────────────────

export type Chunk = { content: string; index: number; tokens: number };

const CHARS_PER_TOKEN = 4;
const TARGET_TOKENS = 800;
const OVERLAP_TOKENS = 100;

export function chunkText(text: string): Chunk[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const target = TARGET_TOKENS * CHARS_PER_TOKEN; // ~3200 chars
  const overlap = OVERLAP_TOKENS * CHARS_PER_TOKEN; // ~400 chars
  const chunks: Chunk[] = [];
  let start = 0;

  while (start < clean.length) {
    let end = Math.min(clean.length, start + target);

    // Snap the cut to a natural boundary in the back half of the window.
    if (end < clean.length) {
      const window = clean.slice(start, end);
      const brk = Math.max(
        window.lastIndexOf("\n\n"),
        window.lastIndexOf("\n"),
        window.lastIndexOf(". "),
      );
      if (brk > target * 0.5) end = start + brk + 1;
    }

    const content = clean.slice(start, end).trim();
    if (content) {
      chunks.push({
        content,
        index: chunks.length,
        tokens: Math.ceil(content.length / CHARS_PER_TOKEN),
      });
    }

    if (end >= clean.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}
