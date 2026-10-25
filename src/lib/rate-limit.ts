import { prisma } from "@/lib/db";

const MINUTE = 60_000;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
};

/**
 * The decision half of the limiter, kept pure so it can be tested without a
 * database. `count` includes the call being decided.
 */
export function decisionFor(
  count: number,
  resetAt: number,
  limit: number,
  now = Date.now(),
): RateLimitResult {
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSec: Math.max(1, Math.ceil((resetAt - now) / 1000)),
  };
}

/**
 * Fixed-window limiter. Counters live in SQLite so a restart does not hand an
 * attacker a fresh allowance, and so two app processes share one window.
 *
 * The write is a single upsert statement: either the window is still open and
 * the count goes up by one, or the window expired and it restarts at one.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): Promise<RateLimitResult> {
  const expiresAt = new Date(now + windowMs);
  const nowDate = new Date(now);

  await prisma.$executeRaw`
    INSERT INTO "RateLimit" ("key", "count", "resetAt", "updatedAt")
    VALUES (${key}, 1, ${expiresAt}, ${nowDate})
    ON CONFLICT("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimit"."resetAt" <= ${nowDate} THEN 1 ELSE "RateLimit"."count" + 1 END,
      "resetAt" = CASE WHEN "RateLimit"."resetAt" <= ${nowDate} THEN ${expiresAt} ELSE "RateLimit"."resetAt" END,
      "updatedAt" = ${nowDate}
  `;

  const row = await prisma.rateLimit.findUnique({
    where: { key },
    select: { count: true, resetAt: true },
  });

  if (!row) {
    return { allowed: true, remaining: limit - 1, retryAfterSec: Math.ceil(windowMs / 1000) };
  }

  return decisionFor(row.count, row.resetAt.getTime(), limit, now);
}

/** Drop counters whose window has passed; cheap, called before a new window. */
export async function pruneRateLimits(now = Date.now()): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { resetAt: { lte: new Date(now) } } });
}

/** Clear a bucket, e.g. after a successful login. */
export async function resetRateLimit(key: string): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key } });
}

type RateLimit = { limit: number; windowMs: number };

/**
 * Defaults are deliberately generous: a whole class can share one school IP,
 * and a student writing several replies or reacting to many posts should not
 * hit a wall. Tighten them per deployment with environment variables rather than
 * editing code. Each pair is `<NAME>_LIMIT` and `<NAME>_WINDOW_MIN`, e.g.
 * `RATE_LIMIT_LOGIN_LIMIT=5`, `RATE_LIMIT_LOGIN_WINDOW_MIN=10`.
 */
function fromEnv(name: string, fallback: RateLimit): RateLimit {
  const limit = Number.parseInt(process.env[`RATE_LIMIT_${name}_LIMIT`] ?? "", 10);
  const minutes = Number.parseInt(process.env[`RATE_LIMIT_${name}_WINDOW_MIN`] ?? "", 10);

  return {
    limit: Number.isFinite(limit) && limit > 0 ? limit : fallback.limit,
    windowMs:
      Number.isFinite(minutes) && minutes > 0 ? minutes * MINUTE : fallback.windowMs,
  };
}

export const RATE_LIMITS = {
  login: fromEnv("LOGIN", { limit: 10, windowMs: 10 * MINUTE }),
  register: fromEnv("REGISTER", { limit: 60, windowMs: 60 * MINUTE }),
  threadCreate: fromEnv("THREAD", { limit: 10, windowMs: 60 * MINUTE }),
  reply: fromEnv("REPLY", { limit: 60, windowMs: 60 * MINUTE }),
  report: fromEnv("REPORT", { limit: 30, windowMs: 24 * 60 * MINUTE }),
  like: fromEnv("LIKE", { limit: 300, windowMs: 60 * MINUTE }),
  bookmark: fromEnv("BOOKMARK", { limit: 300, windowMs: 60 * MINUTE }),
} as const;

/**
 * Client address for a rate-limit key.
 *
 * `X-Forwarded-For` is only read when `TRUST_PROXY=1`, because a direct client
 * can set any value it likes and buy itself a fresh bucket per request. Set the
 * variable only when a reverse proxy in front of the app overwrites the header
 * (Caddy's `reverse_proxy` does). Without it every request shares the same
 * address, so IP-based limits become deliberately conservative while per-account
 * limits keep working.
 */
export function requestIp(request: Request): string | null {
  const trust = process.env.TRUST_PROXY;
  if (trust !== "1" && trust !== "true") {
    return null;
  }
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || null;
}
