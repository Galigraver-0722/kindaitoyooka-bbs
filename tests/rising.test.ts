import assert from "node:assert/strict";
import { test } from "node:test";
import { risingScore, sortByRising } from "@/lib/rising";

const now = new Date("2026-10-25T12:00:00Z").getTime();
const hoursAgo = (hours: number) => new Date(now - hours * 3_600_000);

test("a brand new thread outranks an older thread with the same engagement", () => {
  const fresh = { likeCount: 1, replyCount: 2, lastPostAt: hoursAgo(1) };
  const stale = { likeCount: 1, replyCount: 2, lastPostAt: hoursAgo(30) };

  assert.ok(risingScore(fresh, now) > risingScore(stale, now));
  assert.deepEqual(
    sortByRising([stale, fresh], now).map((row) => row.lastPostAt.getTime()),
    [fresh.lastPostAt.getTime(), stale.lastPostAt.getTime()],
  );
});

test("older but more active threads still rank higher", () => {
  const quiet = { likeCount: 0, replyCount: 1, lastPostAt: hoursAgo(2) };
  const busy = { likeCount: 3, replyCount: 6, lastPostAt: hoursAgo(10) };

  assert.ok(risingScore(busy, now) > risingScore(quiet, now));
});

test("threads quiet for more than 72 hours drop out", () => {
  const old = { likeCount: 9, replyCount: 9, lastPostAt: hoursAgo(73) };

  assert.equal(risingScore(old, now), 0);
  assert.deepEqual(sortByRising([old], now), []);
});

test("equal scores fall back to the most recently updated thread", () => {
  const a = { likeCount: 0, replyCount: 0, lastPostAt: hoursAgo(1) };
  const b = { likeCount: 0, replyCount: 0, lastPostAt: hoursAgo(2) };
  const sorted = sortByRising([b, a], now);

  assert.deepEqual(
    sorted.map((row) => row.lastPostAt.getTime()),
    [a.lastPostAt.getTime(), b.lastPostAt.getTime()],
  );
});
