import assert from "node:assert/strict";
import test from "node:test";
import { canEditThread, isWithinEditWindow, THREAD_EDIT_WINDOW_MS } from "../src/lib/editing";

const now = new Date("2026-10-24T12:00:00Z").getTime();

function thread(overrides: Partial<Parameters<typeof canEditThread>[1]> = {}) {
  return {
    authorId: "author-1",
    createdAt: new Date(now - 60_000),
    isDeleted: false,
    isLocked: false,
    ...overrides,
  };
}

test("authors can edit inside the window", () => {
  assert.equal(canEditThread("author-1", thread(), now), true);
  assert.equal(
    canEditThread("author-1", thread({ createdAt: new Date(now - THREAD_EDIT_WINDOW_MS) }), now),
    true,
  );
});

test("the window closes after fifteen minutes", () => {
  assert.equal(
    canEditThread(
      "author-1",
      thread({ createdAt: new Date(now - THREAD_EDIT_WINDOW_MS - 1) }),
      now,
    ),
    false,
  );
  assert.equal(isWithinEditWindow(new Date(now - THREAD_EDIT_WINDOW_MS - 1), now), false);
});

test("only the author can edit, and never a locked or removed thread", () => {
  assert.equal(canEditThread("someone-else", thread(), now), false);
  assert.equal(canEditThread(undefined, thread(), now), false);
  assert.equal(canEditThread("author-1", thread({ isLocked: true }), now), false);
  assert.equal(canEditThread("author-1", thread({ isDeleted: true }), now), false);
});
