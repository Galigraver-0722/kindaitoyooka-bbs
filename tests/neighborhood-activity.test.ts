import assert from "node:assert/strict";
import test from "node:test";
import { neighborhoodActivity } from "../src/lib/neighborhood-activity";

test("activity buckets cross midnight in JST and fill quiet days with zero", () => {
  const days = neighborhoodActivity([
    new Date("2026-11-04T14:59:59Z"),
    new Date("2026-11-04T15:00:00Z"),
    new Date("2026-11-05T00:00:00Z"),
  ], new Date("2026-11-05T03:00:00Z"));
  assert.equal(days.length, 14);
  assert.deepEqual(days.slice(-2).map(({ date, count }) => ({ date, count })), [
    { date: "2026-11-04", count: 1 }, { date: "2026-11-05", count: 2 },
  ]);
  assert.equal(days[0].date, "2026-10-23");
  assert.equal(days[0].count, 0);
});
test("an empty neighborhood produces a complete zero series", () => {
  assert.ok(neighborhoodActivity([], new Date("2026-11-05T03:00:00Z")).every((day) => day.count === 0));
});
