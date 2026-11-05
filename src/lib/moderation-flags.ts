import { excerptOf } from "@/lib/content-guard";
import type { Hit } from "@/lib/content-filter";
import { prisma } from "@/lib/db";

export type FlagTarget = "PROFILE" | "BOARD";
export type FlagSource = "SCANNER" | "USER";

/**
 * Record advisory matches for public metadata (profile bios and community
 * boards). Unlike a hard block, the text is accepted; a moderator must see it
 * and be able to clear it or archive the board.
 */
export async function recordAdvisoryFlags(input: {
  targetType: FlagTarget;
  targetId: string;
  hits: Hit[];
  texts: string[];
}): Promise<void> {
  const byField = new Map<string, Hit[]>();
  for (const hit of input.hits) {
    const list = byField.get(hit.field) ?? [];
    list.push(hit);
    byField.set(hit.field, list);
  }

  await prisma.moderationFlag.createMany({
    data: [...byField.entries()].map(([field, hits]) => ({
      targetType: input.targetType,
      targetId: input.targetId,
      field,
      words: [...new Set(hits.map((hit) => hit.term))].join(","),
      excerpt: excerptOf(input.texts),
      source: "SCANNER" as const,
    })),
  });
}

/** A reader reports a bio or board description; the same queue handles it. */
export async function recordUserFlag(input: {
  targetType: FlagTarget;
  targetId: string;
  reason: string;
  excerpt: string;
}): Promise<void> {
  await prisma.moderationFlag.create({
    data: {
      targetType: input.targetType,
      targetId: input.targetId,
      field: "report",
      words: input.reason.slice(0, 200),
      excerpt: input.excerpt.slice(0, 40),
      source: "USER",
    },
  });
}
