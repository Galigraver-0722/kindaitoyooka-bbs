import { prisma } from "@/lib/db";

export type NotificationKind = "reply" | "comment" | "like" | "post-like" | "bookmark";

export type NotificationItem = {
  /** Stable id across kinds, so React keys never collide. */
  id: string;
  kind: NotificationKind;
  actor: string;
  createdAt: Date;
  threadId: string;
  threadTitle: string;
  postId?: string;
  /** First characters of the reply or comment, for context in the list. */
  excerpt?: string;
  /** Arrived after the reader last opened the inbox. */
  unread: boolean;
};

export type NotificationFeed = {
  items: NotificationItem[];
  unseen: number;
};

const EXCERPT_LENGTH = 60;

function excerptOf(body: string): string {
  const flat = body.replace(/\s+/g, " ").trim();
  return flat.length > EXCERPT_LENGTH ? `${flat.slice(0, EXCERPT_LENGTH)}…` : flat;
}

/**
 * Build a notification feed from rows that already exist.
 *
 * There is no `Notification` table on purpose: replies, comments, likes, and
 * bookmarks already record who did what to whom, so the feed is a set of small
 * indexed queries instead of a denormalized log that can drift. Only the "last
 * seen" timestamp is stored, on `User.notificationsSeenAt`.
 */
export async function getNotifications(
  userId: string,
  limit = 12,
): Promise<NotificationFeed> {
  const take = Math.max(limit, 12);

  const [replies, comments, postLikes, threadLikes, bookmarks, user] = await Promise.all([
    prisma.post.findMany({
      where: {
        authorId: { not: userId },
        isDeleted: false,
        parent: { authorId: userId, isDeleted: false },
        thread: { isDeleted: false },
      },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: { select: { username: true } },
        thread: { select: { id: true, title: true } },
      },
    }),
    prisma.post.findMany({
      where: {
        authorId: { not: userId },
        isDeleted: false,
        parentId: null,
        thread: { authorId: userId, isDeleted: false },
      },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: { select: { username: true } },
        thread: { select: { id: true, title: true } },
      },
    }),
    prisma.postLike.findMany({
      where: {
        userId: { not: userId },
        post: { authorId: userId, isDeleted: false, thread: { isDeleted: false } },
      },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        createdAt: true,
        user: { select: { username: true } },
        post: { select: { id: true, thread: { select: { id: true, title: true } } } },
      },
    }),
    prisma.threadLike.findMany({
      where: {
        userId: { not: userId },
        thread: { authorId: userId, isDeleted: false },
      },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        createdAt: true,
        user: { select: { username: true } },
        thread: {
          select: {
            id: true,
            title: true,
            posts: {
              where: { isDeleted: false },
              orderBy: { createdAt: "asc" },
              take: 1,
              select: { id: true },
            },
          },
        },
      },
    }),
    prisma.threadBookmark.findMany({
      where: {
        userId: { not: userId },
        thread: { authorId: userId, isDeleted: false },
      },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        createdAt: true,
        user: { select: { username: true } },
        thread: {
          select: {
            id: true,
            title: true,
            posts: {
              where: { isDeleted: false },
              orderBy: { createdAt: "asc" },
              take: 1,
              select: { id: true },
            },
          },
        },
      },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { notificationsSeenAt: true } }),
  ]);

  const raw: Omit<NotificationItem, "unread">[] = [
    ...replies.map((post) => ({
      id: `reply:${post.id}`,
      kind: "reply" as const,
      actor: post.author.username,
      createdAt: post.createdAt,
      threadId: post.thread.id,
      threadTitle: post.thread.title,
      postId: post.id,
      excerpt: excerptOf(post.body),
    })),
    ...comments.map((post) => ({
      id: `comment:${post.id}`,
      kind: "comment" as const,
      actor: post.author.username,
      createdAt: post.createdAt,
      threadId: post.thread.id,
      threadTitle: post.thread.title,
      postId: post.id,
      excerpt: excerptOf(post.body),
    })),
    ...postLikes.map((like) => ({
      id: `post-like:${like.user.username}:${like.post.id}:${like.createdAt.toISOString()}`,
      kind: "post-like" as const,
      actor: like.user.username,
      createdAt: like.createdAt,
      threadId: like.post.thread.id,
      threadTitle: like.post.thread.title,
      postId: like.post.id,
    })),
    ...threadLikes.map((like) => ({
      id: `like:${like.user.username}:${like.thread.id}:${like.createdAt.toISOString()}`,
      kind: "like" as const,
      actor: like.user.username,
      createdAt: like.createdAt,
      threadId: like.thread.id,
      threadTitle: like.thread.title,
      // Thread-level events land on the opening post so the reader sees the
      // title and body, not just the top of the page.
      postId: like.thread.posts[0]?.id,
    })),
    ...bookmarks.map((bookmark) => ({
      id: `bookmark:${bookmark.user.username}:${bookmark.thread.id}:${bookmark.createdAt.toISOString()}`,
      kind: "bookmark" as const,
      actor: bookmark.user.username,
      createdAt: bookmark.createdAt,
      threadId: bookmark.thread.id,
      threadTitle: bookmark.thread.title,
      postId: bookmark.thread.posts[0]?.id,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);

  const seenAt = user?.notificationsSeenAt?.getTime() ?? 0;
  const withSeen: NotificationItem[] = raw.map((item) => ({
    ...item,
    unread: item.createdAt.getTime() > seenAt,
  }));
  const unseen = withSeen.filter((item) => item.unread).length;

  return { items: withSeen, unseen };
}
