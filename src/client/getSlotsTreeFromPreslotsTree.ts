import {removeExtraNodes} from './removeExtraNodes.js';
import {setNodeIndexesToPreslots} from './setNodeIndexesToPreslots.js';

import type {Mutable, NodeIndex, PreslotsTree, SlotsTree} from '../types';

/**
 * Get slots tree from preslots tree.
 * This client function should not use scope variables (except other client functions).
 */
export function getSlotsTreeFromPreslotsTree(
  preslotsTree: PreslotsTree,
  nodeIndexes: readonly NodeIndex[],
  preslotsNodes: readonly PreslotsTree[],
): SlotsTree {
  (preslotsTree as Mutable<typeof preslotsTree>).childrenByKey = undefined;
  (preslotsTree as {proxy: unknown}).proxy = undefined;

  for (const preslotsNode of preslotsNodes) {
    let node = preslotsNode;

    setNodeIndexesToPreslots(node.slots!, nodeIndexes);

    for (let index = 0; index < 10_000; index += 1) {
      const {parent} = node;

      if (parent === undefined) {
        break;
      }

      (node as Mutable<typeof node>).childrenByKey = undefined;
      (node as Mutable<typeof node>).parent = undefined;
      (node as {proxy: unknown}).proxy = undefined;

      node = parent;
    }
  }

  removeExtraNodes(preslotsTree);

  return preslotsTree as SlotsTree;
}
