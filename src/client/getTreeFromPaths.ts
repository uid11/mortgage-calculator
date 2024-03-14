import type {DomTree, Path} from '../types';

type GetTree = (
  listOfProcessedPaths: readonly ProcessedPath[],
  index: number,
) => DomTree | undefined;
type PreNode = {indexInPaths: number | undefined; readonly listOfProcessedPaths: ProcessedPath[]};
type ProcessedPath = Readonly<{indexInPaths: number; path: Path}>;

/**
 * Get tree of path nodes from array of paths.
 * This client function should not use scope variables (except other client functions).
 */
export function getTreeFromPaths(paths: readonly Path[]): DomTree | undefined {
  const allProcessedPaths: readonly ProcessedPath[] = paths.map((path, indexInPaths) => ({
    indexInPaths,
    path,
  }));

  const getTree: GetTree = (listOfProcessedPaths, index) => {
    const preNodesByKeys: Record<string, PreNode> = {__proto__: null as unknown as PreNode};

    for (const processedPath of listOfProcessedPaths) {
      const key = processedPath.path[index];

      if (key === undefined) {
        continue;
      }

      let preNode = preNodesByKeys[key];

      if (preNode === undefined) {
        preNode = {indexInPaths: undefined, listOfProcessedPaths: []};
        preNodesByKeys[key] = preNode;
      }

      if (processedPath.path.length - 1 === index) {
        preNode.indexInPaths = processedPath.indexInPaths;
      } else {
        preNode.listOfProcessedPaths.push(processedPath);
      }
    }

    const entries = Object.entries(preNodesByKeys);

    if (entries.length === 0) {
      return;
    }

    return entries.map(([key, {indexInPaths, listOfProcessedPaths}]) => ({
      children: getTree(listOfProcessedPaths, index + 1),
      indexInPaths,
      key,
    })) satisfies DomTree[0][] as unknown as DomTree;
  };

  return getTree(allProcessedPaths, 0);
}
