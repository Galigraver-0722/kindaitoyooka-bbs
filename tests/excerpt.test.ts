import assert from "node:assert/strict";
import test from "node:test";
import { openingPostExcerpt, postExcerpt } from "../src/lib/excerpt";

test("a short body is returned as-is", () => {
  assert.equal(postExcerpt("今日は文化祭の準備をしました。"), "今日は文化祭の準備をしました。");
});

test("line breaks and full-width spaces collapse to single spaces", () => {
  assert.equal(postExcerpt("一行目\n\n二行目　　三行目"), "一行目 二行目 三行目");
});

test("leading and trailing whitespace is trimmed", () => {
  assert.equal(postExcerpt("  \n 本文 \n "), "本文");
});

test("an empty or whitespace-only body has no excerpt", () => {
  assert.equal(postExcerpt(""), "");
  assert.equal(postExcerpt(" \n\u3000\t "), "");
});

test("long text is cut and marked with an ellipsis", () => {
  const body = "あ".repeat(200);
  const excerpt = postExcerpt(body, 20);
  assert.equal(excerpt, `${"あ".repeat(20)}…`);
});

test("the cut never splits a surrogate pair", () => {
  // Each emoji is one code point but two UTF-16 units.
  const body = "😀".repeat(10);
  const excerpt = postExcerpt(body, 3);
  assert.equal(excerpt, "😀😀😀…");
  assert.equal(Array.from(excerpt).length, 4);
});

test("a cut is not followed by a stray space", () => {
  assert.equal(postExcerpt("abc def ghi", 4), "abc…");
});

test("a deleted opening post produces no excerpt", () => {
  // The body stays in the database for moderators; the feed must blank it.
  assert.equal(openingPostExcerpt({ body: "削除された本文です。", isDeleted: true }), "");
});

test("a missing opening post produces no excerpt", () => {
  assert.equal(openingPostExcerpt(undefined), "");
});

test("a live opening post is excerpted normally", () => {
  assert.equal(openingPostExcerpt({ body: "本文です。", isDeleted: false }), "本文です。");
});
