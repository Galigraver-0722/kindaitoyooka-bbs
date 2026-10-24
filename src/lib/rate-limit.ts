type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
};

/**
 * Fixed-window limiter. The process holds the counters in memory, which is
 * enough for one small deployment; a restart clears them.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): RateLimitResult {
  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  const allowed = bucket.count < limit;
  if (allowed) {
    bucket.count += 1;
  }

  if (buckets.size > 5_000) {
    for (const [bucketKey, value] of buckets) {
      if (value.resetAt <= now) {
        buckets.delete(bucketKey);
      }
    }
  }

  return {
    allowed,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

const MINUTE = 60_000;

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

/** Clear a bucket, e.g. after a successful login. */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

/** Behind Caddy the first X-Forwarded-For entry is the client. */
export function requestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "local";
}
