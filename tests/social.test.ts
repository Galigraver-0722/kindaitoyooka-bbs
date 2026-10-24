import assert from "node:assert/strict";
import test from "node:test";
import { hotScore, sortByHot } from "../src/lib/hot";
import { MAX_TAGS_PER_POST, parseSuggestedTags, parseTagInput } from "../src/lib/tags";

test("tag input accepts Japanese, Latin, and optional hashes", () => {
  assert.deepEqual(parseTagInput("#文化祭 #準備"), ["文化祭", "準備"]);
  assert.deepEqual(parseTagInput("Math, math、テスト"), ["math", "テスト"]);
  assert.deepEqual(parseTagInput("＃全角　#タグ"), ["全角", "タグ"]);
});

test("invalid tag tokens are ignored and tags are capped", () => {
  assert.deepEqual(parseTagInput("ok !! bad#tag"), ["ok"]);
  const tags = parseTagInput("#a #b #c #d #e #f #g");
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

test("board tag hints are normalized and deduplicated", () => {
  assert.deepEqual(parseSuggestedTags("質問, 試験、質問，＃宿題"), ["質問", "試験", "宿題"]);
  assert.deepEqual(parseSuggestedTags(""), []);
  assert.deepEqual(parseSuggestedTags("!!,bad#tag"), []);
});
