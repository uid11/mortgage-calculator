import {createJsx} from './createJsx.js';

import type {InvertedPath, JsxElement} from '../types';

const jsx = createJsx();

/**
 * Process some defined (not `undefined` or `null`) JSX children during compilation of component.
 * This client function should not use scope variables (except other client functions).
 */
export function processJsxChildren(
  children: {},
  domNode: ParentNode,
  invertedPath: InvertedPath,
): void {
  if (typeof children !== 'object') {
    domNode.append(String(children));

    return;
  }

  if (jsx.JSX_ELEMENT_KEY in children) {
    const domElement = document.createElement((children as JsxElement).type as string);
    const key = String(domNode.childNodes.length);

    domNode.append(domElement);

    const path: InvertedPath = {
      children: undefined,
      indexInPaths: undefined,
      key,
      parent: invertedPath,
    };

    const {properties} = children as JsxElement;

    if (properties !== null && properties.children != null) {
      processJsxChildren(properties.children, domElement, path);
    }

    // TODO: add attributes and AttributeSlot

    return;
  }

  // TODO: support TextNodeSlot

  const {length} = children as {length: number};

  if (length > 0 && Number.isInteger(length) && length < 1_000_000) {
    for (let index = 0; index < length; index += 1) {
      const child = (children as Record<number, unknown>)[index];

      if (child != null) {
        processJsxChildren(child, domNode, invertedPath);
      }
    }

    return;
  }

  if (typeof (children as {[Symbol.iterator]?: unknown})[Symbol.iterator] === 'function') {
    for (const child of children as Iterable<unknown>) {
      if (child != null) {
        processJsxChildren(child, domNode, invertedPath);
      }
    }

    return;
  }

  domNode.append(children as ParentNode);
}
