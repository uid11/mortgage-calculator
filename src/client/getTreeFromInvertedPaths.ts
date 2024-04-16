import type {DomTree, InvertedPath, Mutable} from '../types';

type Tree = Omit<Mutable<DomTree>, 'children'> & {children: DomTree[] | undefined};

/**
 * Get tree of path nodes from array of inverted paths.
 * This client function should not use scope variables (except other client functions).
 */
export function getTreeFromInvertedPaths(paths: readonly InvertedPath[]): DomTree | undefined {
  let tree: DomTree | undefined;

  for (let indexInPaths = 0; indexInPaths < paths.length; indexInPaths += 1) {
    let path = paths[indexInPaths]!;

    (path as Tree).indexInPaths = indexInPaths;

    for (let index = 0; index < 10_000; index += 1) {
      const {parent} = path;

      if (parent === undefined) {
        if (tree === undefined) {
          tree = path;
        }

        break;
      }

      (path as Mutable<typeof path>).parent = undefined;

      if (parent.children === undefined) {
        (parent as Tree).children = [];
      }

      (parent as Tree).children!.push(path as DomTree);

      path = parent;
    }
  }

  return tree;
}
