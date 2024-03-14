import type {DomTree, NodeIndex, NodePath} from '../types';

type Result = Readonly<{
  nodeIndexes: readonly NodeIndex[];
  nodePaths: readonly NodePath[];
}>;

/**
 * Get optimized `NodePath` from tree of path nodes.
 * This client function should not use scope variables (except other client functions).
 */
export function getNodePathsFromTree(tree: DomTree): Result {
  const nodeIndexes: NodeIndex[] = [];
  const nodePaths: NodePath[] = [];

  const addNodePaths = (tree: DomTree, nodeIndex: NodeIndex): void => {
    for (const treeNode of tree) {
      let currentNode = treeNode;
      const nodePath: [NodeIndex, ...string[]] = [nodeIndex];

      for (let index = 0; index < 10_000; index += 1) {
        nodePath.push(currentNode.key);

        if (
          currentNode.children === undefined ||
          currentNode.children.length !== 1 ||
          currentNode.indexInPaths !== undefined
        ) {
          break;
        }

        currentNode = currentNode.children[0]!;
      }

      const newNodeIndex = String(nodePaths.push(nodePath)) as NodeIndex;

      if (currentNode.indexInPaths !== undefined) {
        nodeIndexes[currentNode.indexInPaths] = newNodeIndex;
      }

      if (currentNode.children !== undefined && currentNode.children.length > 0) {
        addNodePaths(currentNode.children, newNodeIndex);
      }
    }
  };

  addNodePaths(tree, '0' as NodeIndex);

  return {nodeIndexes, nodePaths};
}
