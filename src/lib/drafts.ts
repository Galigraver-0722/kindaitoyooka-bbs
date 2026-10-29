import { prisma } from "@/lib/db";
import { parseTagInput } from "@/lib/tags";
import { LIMITS } from "@/lib/validation";

/**
 * A thread draft is one row per account and board. Saving replaces it; posting
 * the thread deletes it. Text is clamped to the same limits as a real post so a
 * draft can never hold something the thread endpoint would refuse.
 */
export type DraftInput = {
  boardId: string;
  title: string;
  body: string;
  tags: string;
};

export type DraftView = DraftInput & {
  id: string;
  boardSlug: string;
  boardName: string;
  updatedAt: Date;
};

export function normalizeDraft(input: DraftInput): DraftInput {
  return {
    boardId: input.boardId,
    title: input.title.trim().slice(0, LIMITS.titleMax),
    body: input.body.slice(0, LIMITS.bodyMax),
    tags: input.tags.trim().slice(0, 150),
  };
}

/** Nothing worth keeping: do not create a row for an empty form. */
export function draftIsEmpty(input: DraftInput): boolean {
  return input.title.trim() === "" && input.body.trim() === "" && input.tags.trim() === "";
}

export function draftTagList(tags: string): string[] {
  return parseTagInput(tags);
}

export async function saveDraft(userId: string, input: DraftInput): Promise<DraftView | null> {
  const value = normalizeDraft(input);
  if (draftIsEmpty(value)) {
    await prisma.draft.deleteMany({ where: { userId, boardId: value.boardId } });
    return null;
  }

  const row = await prisma.draft.upsert({
    where: { userId_boardId: { userId, boardId: value.boardId } },
    update: { title: value.title, body: value.body, tags: value.tags },
    create: { userId, ...value },
    include: { board: { select: { slug: true, name: true } } },
  });

  return {
    id: row.id,
    boardId: row.boardId,
    boardSlug: row.board.slug,
    boardName: row.board.name,
    title: row.title,
    body: row.body,
    tags: row.tags,
    updatedAt: row.updatedAt,
  };
}

export async function getDraft(userId: string, boardId: string): Promise<DraftView | null> {
  const row = await prisma.draft.findUnique({
    where: { userId_boardId: { userId, boardId } },
    include: { board: { select: { slug: true, name: true } } },
  });
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    boardId: row.boardId,
    boardSlug: row.board.slug,
    boardName: row.board.name,
    title: row.title,
    body: row.body,
    tags: row.tags,
    updatedAt: row.updatedAt,
  };
}

/** Newest first, for the "continue writing" list on the compose page. */
export async function listDrafts(userId: string): Promise<DraftView[]> {
  const rows = await prisma.draft.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 10,
    include: { board: { select: { slug: true, name: true } } },
  });
  return rows.map((row) => ({
    id: row.id,
    boardId: row.boardId,
    boardSlug: row.board.slug,
    boardName: row.board.name,
    title: row.title,
    body: row.body,
    tags: row.tags,
    updatedAt: row.updatedAt,
  }));
}

export async function deleteDraft(userId: string, id: string): Promise<boolean> {
  const result = await prisma.draft.deleteMany({ where: { id, userId } });
  return result.count > 0;
}

/** Called when a thread is published so the stale copy disappears. */
export async function clearDraftForBoard(userId: string, boardId: string): Promise<void> {
  await prisma.draft.deleteMany({ where: { userId, boardId } });
}
