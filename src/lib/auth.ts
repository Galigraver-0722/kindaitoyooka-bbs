import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/passwords";

export { hashPassword, verifyPassword };

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export const SESSION_COOKIE = "toyooka_session";

export type SessionUser = {
  id: string;
  username: string;
  role: Role;
};

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  await prisma.session.create({
    data: { id: hashToken(token), userId, expiresAt },
  });

  return { token, expiresAt };
}

export function cookieSecure(): boolean {
  if (process.env.COOKIE_SECURE === "true") {
    return true;
  }
  if (process.env.COOKIE_SECURE === "false") {
    return false;
  }
  return process.env.NODE_ENV === "production";
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: cookieSecure(),
    path: "/",
    expires: expiresAt,
  };
}

export async function destroySession(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { id: hashToken(token) } });
}

/**
 * Resolve the signed-in user for the current request. `cache()` keeps this to a
 * single database round trip per request, even when several components call it.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { id: hashToken(token) },
    select: {
      expiresAt: true,
      user: { select: { id: true, username: true, role: true, isSuspended: true } },
    },
  });

  if (!session || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  // A suspended account is treated as signed out on every request, even if a
  // session row somehow survived (suspending deletes them all).
  if (session.user.isSuspended) {
    return null;
  }

  return { id: session.user.id, username: session.user.username, role: session.user.role };
});

/**
 * Day-to-day moderation: remove a post, lock a thread, clear the report queue.
 * Moderators and administrators both hold this power.
 */
export function isModerator(user: SessionUser | null): boolean {
  return user?.role === "MODERATOR" || user?.role === "ADMIN";
}

/**
 * Site-level powers that change the shape of the forum rather than one post:
 * archiving or restoring a board. Kept separate so a moderator cannot quietly
 * close a club's board.
 */
export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === "ADMIN";
}
