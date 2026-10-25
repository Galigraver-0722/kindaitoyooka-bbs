import assert from "node:assert/strict";
import test from "node:test";
import { mergeServerTree, reconcileComments, treeIds, treeSignature } from "../src/lib/comment-merge";

type Node = { id: string; body: string; children: Node[] };

const node = (id: string, body = id, children: Node[] = []): Node => ({ id, body, children });

/** The same attach rule the comment section uses. */
function attach(list: Node[], parentId: string | null, item: Node): Node[] {
  const exists = (nodes: Node[]): boolean =>
    nodes.some((candidate) => candidate.id === parentId || exists(candidate.children));
  if (parentId === null || !exists(list)) return [...list, item];
  const walk = (nodes: Node[]): Node[] =>
    nodes.map((candidate) =>
      candidate.id === parentId
        ? { ...candidate, children: [...candidate.children, item] }
        : { ...candidate, children: walk(candidate.children) },
    );
  return walk(list);
}

test("the signature changes when a reply arrives", () => {
  const before = [node("a", "a", [node("a1")])];
  const after = [node("a", "a", [node("a1"), node("a2")])];
  assert.notEqual(treeSignature(before), treeSignature(after));
});

test("the signature is stable when only bodies change", () => {
  const before = [node("a", "old")];
  const after = [node("a", "new")];
  assert.equal(treeSignature(before), treeSignature(after));
});

test("a reply from another reader lands in the tree", () => {
  const server = [node("a", "a", [node("a1"), node("fresh")])];
  const local = [node("a", "a", [node("a1")])];
  const merged = mergeServerTree(server, local, attach);
  assert.deepEqual(treeIds(merged).size, 3);
  assert.deepEqual(
    merged[0].children.map((child) => child.id),
    ["a1", "fresh"],
  );
});

test("a comment posted locally survives a refresh that does not echo it yet", () => {
  const server = [node("a")];
  const local = [node("a"), node("mine")];
  const merged = mergeServerTree(server, local, attach);
  assert.deepEqual(
    merged.map((item) => item.id),
    ["a", "mine"],
  );
});

test("a local reply keeps its parent when the parent is still on the server", () => {
  const server = [node("a", "a", [node("a1")])];
  const local = [node("a", "a", [node("a1"), node("mine")])];
  const merged = mergeServerTree(server, local, attach);
  assert.deepEqual(
    merged[0].children.map((item) => item.id),
    ["a1", "mine"],
  );
});

test("a local reply whose parent vanished is promoted, not dropped", () => {
  const server: Node[] = [];
  const local = [node("gone", "gone", [node("mine")])];
  const merged = mergeServerTree(server, local, attach);
  assert.deepEqual(
    merged.map((item) => item.id),
    ["gone"],
  );
  assert.deepEqual(
    merged[0].children.map((item) => item.id),
    ["mine"],
  );
});

test("server deletions win over the local copy", () => {
  const server = [node("a"), node("b", "", [])];
  const local = [node("a"), node("b", "still here")];
  const merged = mergeServerTree(server, local, attach);
  assert.equal(merged.length, 2);
  assert.equal(merged[1].body, "");
  assert.equal(new Set(merged.map((item) => item.id)).size, 2);
});

/** Same shape as the component's `renumber`. */
function renumber(list: Node[], prefix = ""): Node[] {
  return list.map((item, index) => {
    const number = prefix ? `${prefix}-${index + 1}` : String(index + 1);
    return { ...item, body: item.body, children: renumber(item.children, number) };
  });
}

test("an unchanged server tree leaves local state alone", () => {
  const server = [node("a")];
  const local = [node("a"), node("mine")];
  const seen = treeSignature(server);
  const next = reconcileComments(server, local, seen, attach, renumber);
  assert.equal(next.comments, local, "same array reference: no re-render churn");
  assert.equal(next.seen, seen);
});

test("a changed server tree is adopted, and the signature moves with it", () => {
  const local = [node("a")];
  const seen = treeSignature(local);
  const server = [node("a", "a", [node("fresh")])];
  const next = reconcileComments(server, local, seen, attach, renumber);
  assert.notEqual(next.comments, local, "a changed tree replaces the local copy");
  assert.deepEqual(
    next.comments.map((item) => item.id),
    ["a"],
  );
  assert.equal(next.seen, treeSignature(server));
  assert.equal(next.comments[0].children.length, 1);
});

test("a reply from another reader lands even when the reader also posted one", () => {
  const first = [node("a")];
  const seen = treeSignature(first);
  const local = [node("a"), node("mine")];
  const server = [node("a", "a", [node("fresh")])];
  const next = reconcileComments(server, local, seen, attach, renumber);
  const ids = next.comments.map((item) => item.id);
  assert.deepEqual(ids, ["a", "mine"]);
  assert.deepEqual(
    next.comments[0].children.map((item) => item.id),
    ["fresh"],
  );
});
