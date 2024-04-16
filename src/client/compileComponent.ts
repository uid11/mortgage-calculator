import {createParseJsx} from './createParseJsx.js';
import {createProxyApi} from './createProxyApi.js';
import {getNodePathsFromTree} from './getNodePathsFromTree.js';
import {getSlotsTreeFromPreslotsTree} from './getSlotsTreeFromPreslotsTree.js';
import {getTreeFromInvertedPaths} from './getTreeFromInvertedPaths.js';

const parseJsx = createParseJsx();
const {clearProxies, getProxyTree} = createProxyApi();

import type {CompiledComponent, Component} from '../types';

/**
 * Compiles component.
 * This client function should not use scope variables (except other client functions).
 */
export function compileComponent(component: Component): CompiledComponent {
  const proxyTree = getProxyTree();

  const jsx = component(proxyTree.proxy as {});

  const {domFragment, paths, preslotsNodes} = parseJsx(jsx);

  clearProxies(proxyTree);

  const domTree = getTreeFromInvertedPaths(paths);
  const {nodeIndexes, nodePaths} = getNodePathsFromTree(domTree!);
  const slotsTree = getSlotsTreeFromPreslotsTree(proxyTree, nodeIndexes, preslotsNodes);

  return {domFragment, nodePaths, slotsTree};
}
