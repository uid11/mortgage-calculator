import type {DomTree, InvertedPath, Mutable} from '../types';

type TreeNode = Mutable<DomTree[0]>;

/**
 * Get tree of path nodes from array of inverted paths.
 * This client function should not use scope variables (except other client functions).
 */
export function getTreeFromInvertedPaths(
  invertedPaths: readonly InvertedPath[],
): DomTree | undefined {
  let treeRoot: TreeNode | undefined;

  for (let indexInPaths = 0; indexInPaths < invertedPaths.length; indexInPaths += 1) {
    let path = invertedPaths[indexInPaths]!;

    (path as TreeNode).indexInPaths = indexInPaths;

    for (let index = 0; index < 10_000; index += 1) {
      const {parent} = path;

      if (parent === undefined) {
        if (treeRoot === undefined) {
          treeRoot = path;
        }

        break;
      }

      (path as Mutable<typeof path>).parent = undefined;

      if (parent.children === undefined) {
        (parent as TreeNode).children = [] as unknown as [TreeNode, ...TreeNode[]];
      }

      (parent as {children: TreeNode[] | undefined}).children!.push(path as TreeNode);

      path = parent;
    }
  }

  return treeRoot === undefined ? undefined : treeRoot.children;
}
