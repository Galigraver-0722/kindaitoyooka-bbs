import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export const SESSION_COOKIE = "toyooka_session";

export type SessionUser = {
  id: string;
  username: string;
  role: Role;
};

/**
 * Hash a password with a random salt. The stored format is
 * `scrypt:<salt-hex>:<derived-key-hex>` so the parameters can be upgraded later
 * without guessing how old hashes were produced.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password.normalize("NFKC"), salt, KEY_LENGTH)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) {
    return false;
  }

  const derived = (await scryptAsync(password.normalize("NFKC"), salt, KEY_LENGTH)) as Buffer;
  const expected = Buffer.from(hash, "hex");

  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

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

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure:
      process.env.COOKIE_SECURE === "true" ||
      (process.env.COOKIE_SECURE !== "false" && process.env.NODE_ENV === "production"),
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
      user: { select: { id: true, username: true, role: true } },
    },
  });

  if (!session || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return session.user;
});

export function isModerator(user: SessionUser | null): boolean {
  return user?.role === "MODERATOR" || user?.role === "ADMIN";
}
