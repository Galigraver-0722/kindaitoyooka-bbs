/**
 * Reconciling a server-rendered comment tree with what the browser already
 * shows.
 *
 * `router.refresh()` (AutoRefresh) hands the client component a fresh `initial`
 * tree, but React ignores later values of `useState`'s argument. Without a
 * reconciliation step a reader would never see a reply that arrived after the
 * page loaded — the very thing live refresh exists for.
 *
 * The merge keeps the server as the source of truth (it carries deletions,
 * like counts, and other readers' comments) and re-attaches comments that only
 * exist locally, i.e. ones just posted whose own response has not been echoed
 * back by a refresh yet.
 */

type Tree = {
  id: string;
  children: Tree[];
};

/** A node whose children have the same shape — what the comment tree is. */
type Recursive<T> = {
  id: string;
  children: T[];
};

/** Depth-first ids, used as the cheap signature of a server tree. */
export function treeSignature(nodes: Tree[]): string {
  const ids: string[] = [];
  const walk = (list: Tree[]) => {
    for (const node of list) {
      ids.push(node.id);
      walk(node.children);
    }
  };
  walk(nodes);
  return ids.join(",");
}

/** Ids present in the tree, in depth-first order. */
export function treeIds(nodes: Tree[]): Set<string> {
  const ids = new Set<string>();
  const walk = (list: Tree[]) => {
    for (const node of list) {
      ids.add(node.id);
      walk(node.children);
    }
  };
  walk(nodes);
  return ids;
}

/**
 * Server tree first, then any local-only comment re-attached under its parent
 * (or at the top level when the parent is gone). Children of local-only nodes
 * come along, because a reply to a just-posted comment is also local-only.
 */
export function mergeServerTree<T extends Recursive<T>>(
  server: T[],
  local: T[],
  attach: (tree: T[], parentId: string | null, node: T) => T[],
): T[] {
  const known = treeIds(server);

  const extras: Array<{ parentId: string | null; node: T }> = [];
  const walk = (list: T[], parentId: string | null) => {
    for (const node of list) {
      if (!known.has(node.id)) {
        extras.push({ parentId, node });
        // A local-only comment carries its own children; leave them attached.
        continue;
      }
      walk(node.children, node.id);
    }
  };
  walk(local, null);

  let tree = server;
  for (const extra of extras) {
    tree = attach(tree, extra.parentId, extra.node);
  }
  return tree;
}

/**
 * What `CommentSection` does when `router.refresh()` hands it a new `initial`
 * tree. Returns the state to keep: the same pair when nothing changed on the
 * server (so an in-progress local edit survives), or a new tree plus its
 * signature when it did.
 *
 * Kept as a pure function because this is the exact place where live refresh
 * used to go wrong: the component sat on its first `initial` forever.
 */
export function reconcileComments<T extends Recursive<T>>(
  server: T[],
  local: T[],
  seen: string,
  attach: (tree: T[], parentId: string | null, node: T) => T[],
  renumber: (tree: T[]) => T[],
): { seen: string; comments: T[] } {
  const signature = treeSignature(server);
  if (signature === seen) {
    return { seen, comments: local };
  }
  return { seen: signature, comments: renumber(mergeServerTree(server, local, attach)) };
}
