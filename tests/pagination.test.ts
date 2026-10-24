import assert from "node:assert/strict";
import test from "node:test";
import { boardPageHref, parsePage, totalPages } from "../src/lib/pagination";

test("page numbers fall back to one", () => {
  assert.equal(parsePage(undefined), 1);
  assert.equal(parsePage(""), 1);
  assert.equal(parsePage("0"), 1);
  assert.equal(parsePage("-3"), 1);
  assert.equal(parsePage("abc"), 1);
  assert.equal(parsePage("2"), 2);
});

test("page counts round up and never reach zero", () => {
  assert.equal(totalPages(0), 1);
  assert.equal(totalPages(20), 1);
  assert.equal(totalPages(21), 2);
  assert.equal(totalPages(100), 5);
});

test("page links keep the sort order and drop a redundant page one", () => {
  assert.equal(boardPageHref("general", { page: 1 }), "/b/general");
  assert.equal(boardPageHref("general", { page: 2 }), "/b/general?page=2");
  assert.equal(boardPageHref("general", { page: 1, sort: "hot" }), "/b/general?sort=hot");
  assert.equal(
    boardPageHref("general", { page: 3, sort: "hot" }),
    "/b/general?sort=hot&page=3",
  );
});
