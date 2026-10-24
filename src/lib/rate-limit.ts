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

export const RATE_LIMITS = {
  login: { limit: 5, windowMs: 10 * 60_000 },
  register: { limit: 5, windowMs: 60 * 60_000 },
  threadCreate: { limit: 5, windowMs: 60 * 60_000 },
  reply: { limit: 20, windowMs: 60 * 60_000 },
  report: { limit: 20, windowMs: 24 * 60 * 60_000 },
  like: { limit: 120, windowMs: 60 * 60_000 },
  bookmark: { limit: 120, windowMs: 60 * 60_000 },
} as const;

/** Behind Caddy the first X-Forwarded-For entry is the client. */
export function requestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "local";
}
