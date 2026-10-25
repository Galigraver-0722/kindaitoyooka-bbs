import assert from "node:assert/strict";
import { test } from "node:test";
import { buildThreadTree, countComments } from "@/lib/thread-tree";

const at = (minute: number) => new Date(Date.UTC(2026, 9, 25, 12, minute, 0));

function post(id: string, parentId: string | null, minute: number) {
  return { id, parentId, createdAt: at(minute) };
}

test("top-level comments are numbered from 1 in creation order", () => {
  const tree = buildThreadTree([post("a", null, 1), post("b", null, 2), post("c", null, 3)]);

  assert.deepEqual(tree.map((node) => node.number), ["1", "2", "3"]);
  assert.equal(countComments(tree), 3);
});

test("replies get the parent number as a prefix", () => {
  const tree = buildThreadTree([
    post("a", null, 1),
    post("b", null, 2),
    post("a1", "a", 3),
    post("a2", "a", 4),
    post("b1", "b", 5),
    post("a1x", "a1", 6),
  ]);

  assert.deepEqual(
    tree.map((node) => node.number),
    ["1", "2"],
  );
  assert.deepEqual(tree[0].children.map((node) => node.number), ["1-1", "1-2"]);
  assert.deepEqual(tree[0].children[0].children.map((node) => node.number), ["1-1-1"]);
  assert.deepEqual(tree[1].children.map((node) => node.number), ["2-1"]);
  assert.equal(countComments(tree), 6);
});

test("replies created before their parent still hang under it", () => {
  const tree = buildThreadTree([post("child", "parent", 1), post("parent", null, 2)]);

  assert.equal(tree.length, 1);
  assert.equal(tree[0].post.id, "parent");
  assert.equal(tree[0].children[0].post.id, "child");
  assert.equal(tree[0].children[0].number, "1-1");
});

test("orphans are promoted to top level instead of disappearing", () => {
  const tree = buildThreadTree([post("a", null, 1), post("lost", "gone", 2)]);

  assert.deepEqual(tree.map((node) => node.post.id), ["a", "lost"]);
  assert.deepEqual(tree.map((node) => node.number), ["1", "2"]);
});

test("depth grows with nesting", () => {
  const tree = buildThreadTree([post("a", null, 1), post("a1", "a", 2), post("a11", "a1", 3)]);

  assert.equal(tree[0].depth, 0);
  assert.equal(tree[0].children[0].depth, 1);
  assert.equal(tree[0].children[0].children[0].depth, 2);
});
