import type {Jsx, JsxElementKey} from '../types';

/**
 * Creates `jsx` API object.
 * This client function should not use scope variables (except other client functions).
 */
export function createJsx(): Jsx {
  const JSX_ELEMENT_KEY: JsxElementKey = Symbol.for(
    'mortgage-calculator:JSX_ELEMENT_KEY',
  ) as JsxElementKey;

  const createElement: Jsx['createElement'] = (type, properties, ...children) => ({
    [JSX_ELEMENT_KEY]: true,
    properties:
      children.length === 0
        ? properties
        : children.length === 1
          ? {...properties, children: children[0]}
          : {...properties, children},
    type,
  });

  const Fragment: Jsx['Fragment'] = () => {};

  return {createElement, Fragment, JSX_ELEMENT_KEY};
}
