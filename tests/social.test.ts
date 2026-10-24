import assert from "node:assert/strict";
import test from "node:test";
import { hotScore, sortByHot } from "../src/lib/hot";
import { MAX_TAGS_PER_POST, parseHashtags } from "../src/lib/tags";

test("hashtags are extracted from Japanese and Latin text", () => {
  assert.deepEqual(parseHashtags("文化祭の話 #文化祭 #準備"), ["文化祭", "準備"]);
  assert.deepEqual(parseHashtags("Math club #Math #math"), ["math"]);
  assert.deepEqual(parseHashtags("全角の＃タグ も使える"), ["タグ"]);
});

test("hashtags inside URLs and words are ignored", () => {
  assert.deepEqual(parseHashtags("see /t/abc#p-123"), []);
  assert.deepEqual(parseHashtags("C# is a language"), []);
});

test("hashtags are capped per post", () => {
  const tags = parseHashtags("#a #b #c #d #e #f #g");
  assert.equal(tags.length, MAX_TAGS_PER_POST);
  assert.deepEqual(tags, ["a", "b", "c", "d", "e"]);
});

test("hot ranking values likes and bookmarks above replies", () => {
  const now = new Date("2026-10-24T12:00:00Z").getTime();
  const base = { replyCount: 1, lastPostAt: new Date("2026-10-24T11:00:00Z") };

  const liked = hotScore({ ...base, likeCount: 1, bookmarkCount: 0 }, now);
  const bookmarked = hotScore({ ...base, likeCount: 0, bookmarkCount: 1 }, now);
  const replied = hotScore({ ...base, likeCount: 0, bookmarkCount: 0, replyCount: 2 }, now);

  assert.ok(liked > bookmarked);
  assert.ok(bookmarked > replied);
});

test("hot sort puts recent activity ahead when scores tie", () => {
  const now = new Date("2026-10-24T12:00:00Z").getTime();
  const older = {
    likeCount: 2,
    bookmarkCount: 0,
    replyCount: 0,
    lastPostAt: new Date("2026-10-01T00:00:00Z"),
  };
  const newer = {
    likeCount: 0,
    bookmarkCount: 0,
    replyCount: 6,
    lastPostAt: new Date("2026-10-24T11:00:00Z"),
  };

  const sorted = sortByHot([older, newer], now);
  assert.equal(sorted[0], newer);
});
