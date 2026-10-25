export type TreeSource = {
  id: string;
  parentId: string | null;
  createdAt: Date;
};

export type TreeNode<T extends TreeSource> = {
  post: T;
  /** Comment number: "1", "2", "1-1", "1-2", "2-1". */
  number: string;
  depth: number;
  children: TreeNode<T>[];
};

/**
 * Builds the Reddit-style comment tree for a thread.
 *
 * The first post of a thread is the root post and is not part of this list.
 * Every other post is a comment: `parentId === null` makes it a top-level
 * comment (numbered 1, 2, 3 …), otherwise it hangs under its parent and is
 * numbered `<parent>.<k>` — rendered as `1-1`, `1-2`, `2-1`. Orphans (parent
 * deleted) are promoted to the top level so their text is never lost.
 */
export function buildThreadTree<T extends TreeSource>(comments: T[]): TreeNode<T>[] {
  const sorted = [...comments].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime() || a.id.localeCompare(b.id),
  );
  const ids = new Set(sorted.map((post) => post.id));
  const childrenOf = new Map<string | null, T[]>();

  for (const post of sorted) {
    const parent = post.parentId && ids.has(post.parentId) ? post.parentId : null;
    const bucket = childrenOf.get(parent) ?? [];
    bucket.push(post);
    childrenOf.set(parent, bucket);
  }

  const attach = (parentId: string | null, prefix: string, depth: number): TreeNode<T>[] => {
    const posts = childrenOf.get(parentId) ?? [];

    return posts.map((post, index) => {
      const number = prefix ? `${prefix}-${index + 1}` : String(index + 1);

      return {
        post,
        number,
        depth,
        children: attach(post.id, number, depth + 1),
      };
    });
  };

  return attach(null, "", 0);
}

/** Total number of comments in the tree (root post excluded). */
export function countComments<T extends TreeSource>(nodes: TreeNode<T>[]): number {
  return nodes.reduce((sum, node) => sum + 1 + countComments(node.children), 0);
}
