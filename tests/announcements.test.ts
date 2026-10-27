import assert from "node:assert/strict";
import test from "node:test";
import { ANNOUNCEMENTS, latestAnnouncementAt, unreadAnnouncements, type Announcement } from "../src/lib/announcements";

const entry = (id: string, publishedAt: string): Announcement => ({
  id,
  publishedAt,
  kind: "release",
  title: { ja: id, en: id },
  body: { ja: id, en: id },
});

test("announcements are newest first", () => {
  const dates = ANNOUNCEMENTS.map((item) => item.publishedAt);
  const sorted = [...dates].sort().reverse();
  assert.deepEqual(dates, sorted);
});

test("every announcement has both languages", () => {
  for (const item of ANNOUNCEMENTS) {
    assert.ok(item.title.ja.length > 0 && item.title.en.length > 0, `${item.id} title`);
    assert.ok(item.body.ja.length > 0 && item.body.en.length > 0, `${item.id} body`);
  }
});

test("a reader who never opened the panel has everything unread", () => {
  assert.equal(unreadAnnouncements(null).length, ANNOUNCEMENTS.length);
});

test("entries published after the seen moment are unread", () => {
  const entries = [entry("new", "2026-10-27"), entry("old", "2026-10-24")];
  const seen = new Date("2026-10-25T12:00:00Z");
  assert.deepEqual(unreadAnnouncements(seen, entries).map((item) => item.id), ["new"]);
});

test("opening the panel after the newest entry leaves nothing unread", () => {
  const entries = [entry("a", "2026-10-24"), entry("b", "2026-10-26")];
  const seen = new Date("2026-10-27T00:00:00Z");
  assert.deepEqual(unreadAnnouncements(seen, entries), []);
});

test("the latest timestamp tracks the newest entry", () => {
  const entries = [entry("a", "2026-01-01"), entry("b", "2026-06-01"), entry("c", "2026-03-01")];
  assert.equal(latestAnnouncementAt(entries), Date.parse("2026-06-01T00:00:00Z"));
});
