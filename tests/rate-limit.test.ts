import assert from "node:assert/strict";
import test from "node:test";
import { checkRateLimit } from "../src/lib/rate-limit";

test("a fixed window allows exactly the configured number of calls", () => {
  const key = `test:${Math.random()}`;
  const now = 1_000_000;

  assert.equal(checkRateLimit(key, 2, 1000, now).allowed, true);
  assert.equal(checkRateLimit(key, 2, 1000, now).allowed, true);

  const blocked = checkRateLimit(key, 2, 1000, now);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSec >= 1);
});

test("the window resets after it expires", () => {
  const key = `test:${Math.random()}`;
  const now = 2_000_000;

  checkRateLimit(key, 1, 1000, now);
  assert.equal(checkRateLimit(key, 1, 1000, now + 500).allowed, false);
  assert.equal(checkRateLimit(key, 1, 1000, now + 1000).allowed, true);
});

test("separate keys do not share counters", () => {
  const now = 3_000_000;
  assert.equal(checkRateLimit(`a:${Math.random()}`, 1, 1000, now).allowed, true);
  assert.equal(checkRateLimit(`b:${Math.random()}`, 1, 1000, now).allowed, true);
});
