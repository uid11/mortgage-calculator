import type {NodeIndex, Preslots} from '../types';

/**
 * Set `nodeIndex` to `node` field of preslots.
 * This client function should not use scope variables (except other client functions).
 */
export function setNodeIndexesToPreslots(
  preslots: Exclude<Preslots, undefined>,
  nodeIndexes: readonly NodeIndex[],
): void {
  for (const preslot of preslots) {
    (preslot as {node: number | NodeIndex}).node = nodeIndexes[preslot.node]!;
  }
}
