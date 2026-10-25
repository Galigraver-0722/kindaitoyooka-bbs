import assert from "node:assert/strict";
import test from "node:test";
import { prisma } from "../src/lib/db";
import { checkRateLimit, decisionFor, pruneRateLimits, resetRateLimit } from "../src/lib/rate-limit";

/** Counters live in SQLite, so these tests use the development database and
 *  clean up their own keys. Keys are namespaced to keep them out of the way. */
const keyFor = (label: string) => `test:rate-limit:${label}:${Math.random().toString(36).slice(2)}`;

test("a fixed window allows exactly the configured number of calls", async () => {
  const key = keyFor("allow");
  try {
    assert.equal((await checkRateLimit(key, 2, 60_000)).allowed, true);
    assert.equal((await checkRateLimit(key, 2, 60_000)).allowed, true);

    const blocked = await checkRateLimit(key, 2, 60_000);
    assert.equal(blocked.allowed, false);
    assert.ok(blocked.retryAfterSec >= 1);
  } finally {
    await resetRateLimit(key);
  }
});

test("separate keys do not share counters", async () => {
  const a = keyFor("a");
  const b = keyFor("b");
  try {
    assert.equal((await checkRateLimit(a, 1, 60_000)).allowed, true);
    assert.equal((await checkRateLimit(a, 1, 60_000)).allowed, false);
    assert.equal((await checkRateLimit(b, 1, 60_000)).allowed, true);
  } finally {
    await resetRateLimit(a);
    await resetRateLimit(b);
  }
});

test("a successful login can clear its own bucket", async () => {
  const key = keyFor("reset");
  try {
    assert.equal((await checkRateLimit(key, 1, 60_000)).allowed, true);
    assert.equal((await checkRateLimit(key, 1, 60_000)).allowed, false);

    await resetRateLimit(key);
    assert.equal((await checkRateLimit(key, 1, 60_000)).allowed, true);
  } finally {
    await resetRateLimit(key);
    await prisma.$disconnect();
  }
});

test("the window restarts after it expires", () => {
  const start = 1_000_000;
  const first = decisionFor(1, start + 1000, 1, start);
  assert.equal(first.allowed, true);

  const stillOpen = decisionFor(2, start + 1000, 1, start + 500);
  assert.equal(stillOpen.allowed, false);

  // A new window is a new count of 1, decided by the same pure function.
  const reset = decisionFor(1, start + 2000, 1, start + 1000);
  assert.equal(reset.allowed, true);
  assert.ok(reset.retryAfterSec >= 1);
});

test("pruning drops expired counters only", async () => {
  const expired = keyFor("expired");
  const live = keyFor("live");
  try {
    await prisma.rateLimit.create({
      data: { key: expired, count: 3, resetAt: new Date(Date.now() - 60_000) },
    });
    await prisma.rateLimit.create({
      data: { key: live, count: 3, resetAt: new Date(Date.now() + 60_000) },
    });

    await pruneRateLimits();

    const gone = await prisma.rateLimit.findUnique({ where: { key: expired } });
    const kept = await prisma.rateLimit.findUnique({ where: { key: live } });
    assert.equal(gone, null);
    assert.notEqual(kept, null);
  } finally {
    await resetRateLimit(live);
    await prisma.$disconnect();
  }
});
