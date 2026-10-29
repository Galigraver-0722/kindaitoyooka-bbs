import assert from "node:assert/strict";
import test from "node:test";
import { draftIsEmpty, draftTagList, normalizeDraft } from "../src/lib/drafts";
import { LIMITS } from "../src/lib/validation";

const base = { boardId: "b1", title: "", body: "", tags: "" };

test("an untouched form is not a draft", () => {
  assert.equal(draftIsEmpty(base), true);
  assert.equal(draftIsEmpty({ ...base, title: "  " }), true);
  assert.equal(draftIsEmpty({ ...base, body: "a" }), false);
  assert.equal(draftIsEmpty({ ...base, tags: "x" }), false);
});

test("a draft is clamped to what a post would accept", () => {
  const long = normalizeDraft({
    boardId: "b1",
    title: "t".repeat(LIMITS.titleMax + 20),
    body: "b".repeat(LIMITS.bodyMax + 50),
    tags: "x".repeat(200),
  });
  assert.equal(long.title.length, LIMITS.titleMax);
  assert.equal(long.body.length, LIMITS.bodyMax);
  assert.equal(long.tags.length, 150);
  assert.equal(long.title, long.title.trim());
});

test("tags keep the same parser the composer uses", () => {
  assert.deepEqual(draftTagList("文化祭, 実行委員 ステージ"), ["文化祭", "実行委員", "ステージ"]);
  assert.deepEqual(draftTagList(""), []);
});
