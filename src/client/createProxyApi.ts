import type {
  Mutable,
  ProxyObject,
  ProxyTarget,
  ProxyTree,
  PROXY_TARGET_KEY as TARGET_KEY,
} from '../types';

type Result = Readonly<{
  clearProxy: (proxy: ProxyObject) => void;
  getProxyNode: (key?: string | symbol) => ProxyTree[0];
  PROXY_TARGET_KEY: typeof TARGET_KEY;
}>;

/**
 * Creates functions `getProxyTreeRoot`, `clearProxy` and key `PROXY_TARGET_KEY`.
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

      const node: Mutable<ProxyTree[0]> = target.node!;
      let child: ProxyTree[0] | undefined;

      if (node.children === undefined) {
        node.children = [] as unknown as ProxyTree;
        node.childrenByKey = {__proto__: null as unknown as ProxyTree[0]};
      } else {
        child = node.childrenByKey![key];
      }

      if (child === undefined) {
        child = getProxyNode(key);

        (node.children as Mutable<typeof node.children>).push(child);
        (node.childrenByKey as Mutable<typeof node.childrenByKey>)![key] = child;
      }

      return child.proxy;
    },
    ownKeys: () => emptyArray,
    preventExtensions: getFalse,
    set: getFalse,
  };

  const clearProxy = (proxy: ProxyObject): void => {
    const target = proxy[PROXY_TARGET_KEY];

    target.node = undefined;

    if (proxiesPool.length < maxProxiesPoolLength) {
      proxiesPool.push(proxy);
    }
  };

  const getProxyNode = (key: string | symbol = ''): ProxyTree[0] => {
    const proxy =
      proxiesPool.length > 0
        ? proxiesPool.pop()!
        : (new Proxy({node: undefined}, handler) as unknown as ProxyObject);
    const node: ProxyTree[0] = {children: undefined, childrenByKey: undefined, key, proxy};
    const target = proxy[PROXY_TARGET_KEY];

    target.node = node;

    return node;
  };

  return {clearProxy, getProxyNode, PROXY_TARGET_KEY};
}
