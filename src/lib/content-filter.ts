import { scanContentAll, type Field, type Hit, type ScanResult } from "@/lib/sensitive-words";

export type { Field, Hit, ScanResult };

/**
 * Run the scanner over a set of fields. Call this on every write path that
 * stores text a reader will see: thread titles, bodies, tags, replies, board
 * names and descriptions, and profile bios.
 *
 * The fields stay separate so the moderator record can say *where* the word was
 * found — a title violation and a body violation are different problems.
 */
export function scanPost(fields: Array<{ field: Field; text: string }>): ScanResult {
  return scanContentAll(fields.filter((item) => item.text.trim().length > 0));
}

/**
 * "Did anything match" helper, kept for callers that do not need the
 * block/flag distinction.
 */
export function detectSensitiveText(...texts: string[]): string[] {
  const { blocked, flagged } = scanPost(
    texts.map((text, index) => ({ field: (index === 0 ? "title" : "body") as Field, text })),
  );
  const terms = [...new Set([...blocked, ...flagged].map((hit) => hit.term))];
  return terms.slice(0, 5);
}
