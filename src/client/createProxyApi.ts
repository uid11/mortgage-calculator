import type {
  Mutable,
  ProxyObject,
  ProxyTarget,
  ProxyTree,
  PROXY_TARGET_KEY as TARGET_KEY,
} from '../types';

type Result = Readonly<{
  clearProxies: (tree: ProxyTree) => void;
  getProxyTree: (key?: string | symbol, parent?: ProxyTree, targets?: ProxyTarget[]) => ProxyTree;
  PROXY_TARGET_KEY: typeof TARGET_KEY;
}>;

/**
 * Creates functions `clearProxies`, `getProxyTree` and key `PROXY_TARGET_KEY`.
 * This client function should not use scope variables (except other client functions).
 */
export function createProxyApi(): Result {
  const emptyArray: [] = [];
  const getFalse = () => false;
  const maxProxiesPoolLength = 512;
  const proxiesPool: ProxyObject[] = [];
  const PROXY_TARGET_KEY: typeof TARGET_KEY = Symbol.for(
    'mortgage-calculator:PROXY_TARGET_KEY',
  ) as typeof TARGET_KEY;

  const handler: ProxyHandler<ProxyTarget> = {
    defineProperty: getFalse,
    deleteProperty: getFalse,
    get(target, key) {
      if (key === PROXY_TARGET_KEY) {
        return target;
      }

      const node: Mutable<ProxyTree> = target.node!;
      let child: ProxyTree | undefined;

      if (node.children === undefined) {
        node.children = [] as unknown as [ProxyTree, ...ProxyTree[]];
        node.childrenByKey = {__proto__: null as unknown as ProxyTree};
      } else {
        child = node.childrenByKey![key];
      }

      if (child === undefined) {
        child = getProxyTree(key, node, target.targets!);

        (node.children as Mutable<typeof node.children>).push(child);
        (node.childrenByKey as Mutable<typeof node.childrenByKey>)![key] = child;
      }

      return child.proxy;
    },
    ownKeys: () => emptyArray,
    preventExtensions: getFalse,
    set: getFalse,
  };

  const clearProxies: Result['clearProxies'] = (tree) => {
    const {targets} = tree.proxy[PROXY_TARGET_KEY];

    if (targets === undefined) {
      return;
    }

    for (const target of targets) {
      const {proxy} = target.node!;

      target.node = undefined;
      target.targets = undefined;

      if (proxiesPool.length < maxProxiesPoolLength) {
        proxiesPool.push(proxy);
      }
    }
  };

  const getProxyTree: Result['getProxyTree'] = (key = '', parent, targets = []) => {
    const proxy =
      proxiesPool.length > 0
        ? proxiesPool.pop()!
        : (new Proxy({node: undefined, targets}, handler) as unknown as ProxyObject);
    const node: ProxyTree = {
      children: undefined,
      childrenByKey: undefined,
      key,
      parent,
      proxy,
      slots: undefined,
    };
    const target = proxy[PROXY_TARGET_KEY];

    target.node = node;
    targets.push(target);

    return node;
  };

  return {clearProxies, getProxyTree, PROXY_TARGET_KEY};
}
