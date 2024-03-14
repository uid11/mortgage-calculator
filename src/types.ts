import type {ReactNode} from 'react';

/**
 * Creates brand (nominal) type from regular type.
 * `Brand<string, 'NodeIndex'>` = `NodeIndex`.
 */
export type Brand<Type, Key extends string> = Type & {readonly [BRAND]: Key};

/**
 * Compiled component.
 */
export type CompiledComponent = Readonly<{
  dependencies: readonly Dependency[];
  domFragment: DocumentFragment;
  nodePaths: readonly NodePath[];
}>;

/**
 * Component.
 */
export type Component = (props?: {children?: unknown}) => ReactNode;

/**
 * Tree of path nodes (subtree of DOM).
 */
export type DomTree = Tree<{indexInPaths: number | undefined}, string>;

/**
 * Inverted path (from node to ancestors).
 */
export type InvertedPath = Readonly<
  {
    key: string;
    parent: InvertedPath | undefined;
  } & Record<Exclude<keyof DomTree[0], 'key'>, undefined>
>;

/**
 * Key of JSX element.
 */
export declare const JSX_ELEMENT_KEY: unique symbol;

/**
 * JSX namespace.
 */
export type Jsx = Readonly<{
  createElement: (
    type: string | object,
    properties: object | null,
    ...children: readonly unknown[]
  ) => JsxElement;
  Fragment: () => void;
  JSX_ELEMENT_KEY: JsxElementKey;
}>;

/**
 * JSX element, created by `createElement`.
 */
export type JsxElement = Readonly<{
  [JSX_ELEMENT_KEY]: true;
  properties: {children?: unknown} | null;
  type: string | object;
}>;

/**
 * Type of key of JSX element.
 */
export type JsxElementKey = typeof JSX_ELEMENT_KEY;

/**
 * Returns a copy of the object type with mutable properties.
 * `Mutable<{readonly foo: string}>` = `{foo: string}`.
 */
export type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key];
};

/**
 * Index of node in component instance nodes.
 */
export type NodeIndex = Brand<string, 'NodeIndex'>;

/**
 * Optimized path in `nodePaths` array.
 */
export type NodePath = readonly [NodeIndex, ...Path];

/**
 * Path to some tree.
 */
export type Path = readonly string[];

/**
 * Proxy object.
 */
export type ProxyObject = Readonly<{[PROXY_TARGET_KEY]: ProxyTarget}>;

/**
 * Target of proxy object.
 */
export type ProxyTarget = {node: ProxyTree[0] | undefined};

/**
 * Tree of proxies (subtree of component properties).
 */
export type ProxyTree = TreeWithChildrenHash<{proxy: ProxyObject}>;

/**
 * Key of `target` in proxy object.
 */
export declare const PROXY_TARGET_KEY: unique symbol;

/**
 * Type of key of `target` in proxy object.
 */
export type ProxyTargetKey = typeof PROXY_TARGET_KEY;

type AttributeSlot = Readonly<{
  name: string;
  node: NodeIndex;
}>;

/**
 * Inner key for brand types.
 */
declare const BRAND: unique symbol;

type Dependency = Readonly<{
  attributes: readonly AttributeSlot[];
  key: string;
  textNodes: readonly TextNodeSlot[];
}>;

type TextNodeSlot = Readonly<{
  node: NodeIndex;
}>;

/**
 * General tree.
 */
type Tree<Properties extends object, Key extends string | symbol> = readonly [
  TreeNode<Properties, Key>,
  ...TreeNode<Properties, Key>[],
];

/**
 * Node of general tree.
 */
type TreeNode<Properties extends object, Key extends string | symbol> = Readonly<
  {children: Tree<Properties, Key> | undefined; key: Key} & Properties
>;

/**
 * General tree with children hash (`childrenByKey`) and `string | symbol` keys.
 */
type TreeWithChildrenHash<Properties extends object> = Tree<
  {
    childrenByKey:
      | Readonly<Record<string | symbol, TreeWithChildrenHash<Properties>[0]>>
      | undefined;
  } & Properties,
  string | symbol
>;
