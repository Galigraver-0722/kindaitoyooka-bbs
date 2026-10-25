import assert from "node:assert/strict";
import test from "node:test";
import { normalizeTerm, searchScore, sortByRelevance } from "../src/lib/search";

const base = {
  likeCount: 0,
  bookmarkCount: 0,
  replyCount: 0,
};

test("a title hit outweighs a body hit", () => {
  const title = searchScore("数学", { ...base, title: "数学の質問", tagNames: [], bodies: [] });
  const body = searchScore("数学", { ...base, title: "質問です", tagNames: [], bodies: ["数学がわかりません"] });
  assert.ok(title > body, `${title} should beat ${body}`);
});

test("an exact title match wins", () => {
  const exact = searchScore("文化祭", { ...base, title: "文化祭", tagNames: [], bodies: [] });
  const partial = searchScore("文化祭", { ...base, title: "文化祭の準備", tagNames: [], bodies: [] });
  assert.ok(exact > partial, `${exact} should beat ${partial}`);
});

test("tags count, and the leading hash is ignored", () => {
  const withTag = searchScore("#数学", { ...base, title: "質問", tagNames: ["数学"], bodies: [] });
  const withoutTag = searchScore("#数学", { ...base, title: "質問", tagNames: [], bodies: [] });
  assert.ok(withTag > withoutTag);
  assert.equal(normalizeTerm("#数学"), "数学");
});

test("search is case-insensitive for latin text", () => {
  const upper = searchScore("CLUB", { ...base, title: "Photo Club", tagNames: [], bodies: [] });
  const lower = searchScore("club", { ...base, title: "Photo Club", tagNames: [], bodies: [] });
  assert.equal(upper, lower);
  assert.ok(upper > 0);
});

test("an old but relevant thread outranks a recent irrelevant one", () => {
  const now = new Date("2026-10-25T00:00:00Z");
  const old = new Date("2026-06-01T00:00:00Z");
  const ranked = sortByRelevance("定積分", [
    { ...base, title: "雑談", tagNames: [], bodies: ["今日は暑い"], lastPostAt: now },
    { ...base, title: "定積分の解き方", tagNames: [], bodies: ["定積分がわかりません"], lastPostAt: old },
  ]);
  assert.equal(ranked[0].title, "定積分の解き方");
});

test("a zero-score query keeps the newest first as a tiebreak", () => {
  const newer = new Date("2026-10-25T00:00:00Z");
  const older = new Date("2026-10-01T00:00:00Z");
  const ranked = sortByRelevance("", [
    { ...base, title: "A", tagNames: [], bodies: [], lastPostAt: older },
    { ...base, title: "B", tagNames: [], bodies: [], lastPostAt: newer },
  ]);
  assert.equal(ranked[0].title, "B");
});
