import type {DomTree, Mutable, NodeIndex, NodePath} from '../types';

type ProcessNodes = (nodes: readonly [DomTree, ...DomTree[]], nodeIndex: NodeIndex) => void;

type Result = Readonly<{nodeIndexes: readonly NodeIndex[]; nodePaths: readonly NodePath[]}>;

/**
 * Get optimized `NodePath` from tree of path nodes.
 * This client function should not use scope variables (except other client functions).
 */
export function getNodePathsFromTree(tree: DomTree): Result {
  const nodeIndexes: NodeIndex[] = [];
  const nodePaths: NodePath[] = [];

  const processNodes: ProcessNodes = (nodes, nodeIndex) => {
    for (const startNode of nodes) {
      let node = startNode;
      const nodePath: Mutable<NodePath> = [nodeIndex];

      for (let index = 0; index < 10_000; index += 1) {
        nodePath.push(node.key);

        if (
          node.children === undefined ||
          node.children.length !== 1 ||
          node.indexInPaths !== undefined
        ) {
          break;
        }

        node = node.children[0]!;
      }

      const newNodeIndex = String(nodePaths.push(nodePath)) as NodeIndex;

      if (node.indexInPaths !== undefined) {
        nodeIndexes[node.indexInPaths] = newNodeIndex;
      }

      if (node.children !== undefined && node.children.length > 0) {
        processNodes(node.children, newNodeIndex);
      }
    }
  };

  if (tree.children !== undefined) {
    processNodes(tree.children, '0' as NodeIndex);
  }

  return {nodeIndexes, nodePaths};
}
