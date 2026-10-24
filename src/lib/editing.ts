export const THREAD_EDIT_WINDOW_MS = 15 * 60_000;

export type EditableThread = {
  authorId: string;
  createdAt: Date;
  isDeleted: boolean;
  isLocked: boolean;
};

/**
 * Authors may fix typos and add missing context for a short window after
 * posting. Locked or removed threads stay frozen so moderation decisions are
 * not edited around. Moderators use the separate remove/lock tools.
 */
export function canEditThread(
  userId: string | undefined,
  thread: EditableThread,
  now = Date.now(),
): boolean {
  if (!userId || userId !== thread.authorId) {
    return false;
  }
  if (thread.isDeleted || thread.isLocked) {
    return false;
  }

  const elapsed = now - thread.createdAt.getTime();
  return elapsed >= 0 && elapsed <= THREAD_EDIT_WINDOW_MS;
}

export function isWithinEditWindow(createdAt: Date, now = Date.now()): boolean {
  const elapsed = now - createdAt.getTime();
  return elapsed >= 0 && elapsed <= THREAD_EDIT_WINDOW_MS;
}
