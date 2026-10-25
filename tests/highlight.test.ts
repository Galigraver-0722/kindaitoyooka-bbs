import assert from "node:assert/strict";
import test from "node:test";
import { normalizeHighlightTerm, splitHighlight } from "../src/lib/highlight";
import { formatUnread } from "../src/components/theme/notification-inbox";

test("a search term is marked wherever it appears", () => {
  const parts = splitHighlight("数学のテストと数学の宿題", "数学");
  assert.equal(parts.filter((part) => part.hit).length, 2);
  assert.equal(parts.filter((part) => part.hit).map((part) => part.text).join(""), "数学数学");
});

test("matching is case-insensitive and keeps the original casing", () => {
  const parts = splitHighlight("Photo Club", "club");
  assert.deepEqual(parts, [
    { text: "Photo ", hit: false },
    { text: "Club", hit: true },
  ]);
});

test("a leading hash on a tag search is ignored", () => {
  assert.equal(normalizeHighlightTerm("#文化祭"), "文化祭");
  const parts = splitHighlight("文化祭の準備", "#文化祭");
  assert.equal(parts.find((part) => part.hit)?.text, "文化祭");
});

test("an empty term leaves the text alone", () => {
  assert.deepEqual(splitHighlight("そのまま", ""), [{ text: "そのまま", hit: false }]);
  assert.deepEqual(splitHighlight("そのまま", undefined), [{ text: "そのまま", hit: false }]);
});

test("a term longer than the text produces no marks", () => {
  const parts = splitHighlight("短文", "もっと長い検索語");
  assert.equal(parts.some((part) => part.hit), false);
  assert.equal(parts.map((part) => part.text).join(""), "短文");
});

test("the unread badge caps at 99+", () => {
  assert.equal(formatUnread(0), "");
  assert.equal(formatUnread(7), "7");
  assert.equal(formatUnread(99), "99");
  assert.equal(formatUnread(100), "99+");
  assert.equal(formatUnread(1234), "99+");
});
