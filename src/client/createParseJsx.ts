import {createJsx} from './createJsx.js';
import {createProxyApi} from './createProxyApi.js';
import {renderAttribute} from './renderAttribute.js';
import {renderChild} from './renderChild.js';

import type {
  InvertedPath,
  JsxElement,
  Mutable,
  Preslots,
  PreslotsTree,
  ProxyTarget,
} from '../types';

const {Fragment, JSX_ELEMENT_KEY} = createJsx();
const {PROXY_TARGET_KEY} = createProxyApi();

type MutablePreslots = Exclude<Preslots, undefined>[number][] | undefined;

type ParseJsx = (jsx: unknown) => Readonly<{
  domFragment: DocumentFragment;
  paths: readonly InvertedPath[];
  preslotsNodes: readonly PreslotsTree[];
}>;

/**
 * Creates `parseJsx` function for parsing JSX value during compilation of component.
 * This client function should not use scope variables (except other client functions).
 */
export function createParseJsx(): ParseJsx {
  var createPath = (key = '', parent?: InvertedPath): InvertedPath => ({
    children: undefined,
    indexInPaths: undefined,
    key,
    parent,
  });

  var getPreslots = (value: unknown): MutablePreslots => {
    if (value == null) {
      return;
    }

    const target = (value as Record<symbol, ProxyTarget | undefined>)[PROXY_TARGET_KEY];

    if (target === undefined) {
      return;
    }

    const {node} = target as {node: Mutable<PreslotsTree>};
    let {slots} = node;

    if (slots === undefined) {
      slots = node.slots = [] as unknown as Preslots;
      preslotsNodes!.push(node);
    }

    return slots as MutablePreslots;
  };

  var parseToNode = (jsx: unknown, domNode: ParentNode, path: InvertedPath): void => {
    if (jsx == null) {
      return;
    }

    if (typeof jsx !== 'object') {
      domNode.append(jsx as string);

      return;
    }

    if (JSX_ELEMENT_KEY in jsx) {
      const {properties, type} = jsx as JsxElement;

      if (type === Fragment) {
        parseToNode(properties && properties.children, domNode, path);

        return;
      }

      const domElement = document.createElement(type as string);
      const key = String(domNode.childNodes.length);

      domNode.append(domElement);

      const newPath = createPath(key, path);

      if (properties !== null) {
        let shouldAddPath = false;

        for (const name in properties) {
          const value = (properties as Record<string, unknown>)[name];
          const preslots = getPreslots(value);

          if (preslots === undefined) {
            domElement.setAttribute(name, value as string);
          } else {
            preslots.push({name, node: paths!.length, render: renderAttribute});
            shouldAddPath = true;
          }
        }

        if (shouldAddPath) {
          paths!.push(newPath);
        }

        parseToNode(properties.children, domElement, newPath);
      }

      return;
    }

    const preslots = getPreslots(jsx);

    if (preslots !== undefined) {
      const key = String(domNode.childNodes.length);

      domNode.append('');

      preslots.push({node: paths!.length, render: renderChild});

      paths!.push(createPath(key, path));

      return;
    }

    const {length} = jsx as {length: number};

    if (length > 0 && Number.isInteger(length) && length < 1_000_000) {
      for (let index = 0; index < length; index += 1) {
        const child = (jsx as Record<number, unknown>)[index];

        parseToNode(child, domNode, path);
      }

      return;
    }

    if (typeof (jsx as Iterable<unknown>)[Symbol.iterator] === 'function') {
      for (const child of jsx as Iterable<unknown>) {
        parseToNode(child, domNode, path);
      }

      return;
    }

    domNode.append(jsx as ParentNode);
  };

  var paths: InvertedPath[] | undefined;
  var preslotsNodes: PreslotsTree[] | undefined;

  const parseJsx: ParseJsx = (jsx) => {
    paths = [];
    preslotsNodes = [];

    const domFragment = document.createDocumentFragment();

    parseToNode(jsx, domFragment, createPath());

    const result = {domFragment, paths, preslotsNodes};

    paths = undefined;
    preslotsNodes = undefined;

    return result;
  };

  return parseJsx;
}
