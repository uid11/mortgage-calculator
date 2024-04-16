import type {Mutable, PreslotsTree} from '../types';

/**
 * Removes extra nodes (nodes that do not lead to nodes with slots) from preslots tree.
 * This client function should not use scope variables (except other client functions).
 */
export function removeExtraNodes(preslotsTree: PreslotsTree): void {
  const {children} = preslotsTree;

  if (children === undefined) {
    return;
  }

  let newChildren: PreslotsTree[] | undefined;

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index]!;

    if (child.parent === undefined) {
      removeExtraNodes(child);

      if (newChildren !== undefined) {
        newChildren.push(child);
      }
    } else if (newChildren === undefined) {
      newChildren = children.slice(0, index);
    }
  }

  if (newChildren !== undefined) {
    if (newChildren.length > 0) {
      (preslotsTree as {children: PreslotsTree[] | undefined}).children = newChildren;
    } else {
      (preslotsTree as Mutable<PreslotsTree>).children = undefined;
    }
  }
}
