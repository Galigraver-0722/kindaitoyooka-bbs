import assert from "node:assert/strict";
import test from "node:test";
import { formatDateTime } from "../src/lib/format";
import { dictionaries, isLocale, t } from "../src/lib/locales";

function shape(value: unknown): unknown {
  if (typeof value === "function") {
    return "function";
  }
  if (Array.isArray(value)) {
    return { array: value.length };
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, shape(child)]),
    );
  }
  return typeof value;
}

test("English and Japanese expose the same structure", () => {
  assert.deepEqual(shape(dictionaries.ja), shape(dictionaries.en));
});

test("locale values are validated", () => {
  assert.equal(isLocale("en"), true);
  assert.equal(isLocale("ja"), true);
  assert.equal(isLocale("fr"), false);
  assert.equal(isLocale(undefined), false);
  assert.equal(isLocale(""), false);
});

test("interpolated strings differ by locale", () => {
  assert.equal(t("en").board.threadMeta("sakura", 2), "by sakura · 2 replies");
  assert.equal(t("ja").board.threadMeta("sakura", 2), "sakura・返信 2 件");
});

test("dates are rendered in JST with locale-specific formatting", () => {
  // 2026-10-24T13:00:00Z is 22:00 in Japan.
  const date = new Date(Date.UTC(2026, 9, 24, 13, 0, 0));

  assert.match(formatDateTime(date, "en"), /Oct 24, 2026/);
  assert.match(formatDateTime(date, "ja"), /2026年10月24日/);
  assert.match(formatDateTime(date, "en"), /10:00 PM/);
  assert.match(formatDateTime(date, "ja"), /22:00/);
  assert.match(formatDateTime(date, "ja"), /JST$/);
});
