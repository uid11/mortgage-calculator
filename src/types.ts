import type {ReactNode} from 'react';

/**
 * Slot for inserting attribute with given name.
 */
export type AttributeSlot = Slot<{readonly name: string}>;

/**
 * Creates brand (nominal) type from regular type.
 * `Brand<string, 'NodeIndex'>` = `NodeIndex`.
 */
export type Brand<Type, Key extends string> = Type & {readonly [BRAND]: Key};

/**
 * Slot for inserting child node (DOM node, text node, or other component instance).
 */
export type ChildSlot = Slot<{}>;

/**
 * Compiled component.
 */
export type CompiledComponent = Readonly<{
  domFragment: DocumentFragment;
  nodePaths: readonly NodePath[];
  slotsTree: SlotsTree;
}>;

/**
 * Component.
 */
export type Component = (props?: {children?: unknown}) => ReactNode;

/**
 * Tree of paths to DOM nodes (subtree of DOM).
 */
export type DomTree = Tree<{indexInPaths: number | undefined}, string>;

/**
 * Inverted path (from node to ancestors).
 */
export type InvertedPath = Readonly<
  {
    key: string;
    parent: InvertedPath | undefined;
  } & Record<Exclude<keyof DomTree, 'key'>, undefined>
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
 * Preslot for inserting attribute with given name.
 */
export type PreAttributeSlot = Preslot<AttributeSlot>;

/**
 * Preslot for inserting child node (DOM node, text node, or other component instance).
 */
export type PreChildSlot = Preslot<ChildSlot>;

/**
 * List of all preslots for concrete value (path) in properties.
 */
export type Preslots = MaybeArray<PreAttributeSlot | PreChildSlot>;

/**
 * Tree of preslots (subtree of component properties).
 */
export type PreslotsTree = TreeWithChildrenHashAndParent<{
  proxy: ProxyObject;
  slots: Preslots;
}>;

/**
 * Proxy object.
 */
export type ProxyObject = Readonly<{[PROXY_TARGET_KEY]: ProxyTarget}>;

/**
 * Target of proxy object.
 */
export type ProxyTarget = {node: ProxyTree | undefined; targets: ProxyTarget[] | undefined};

/**
 * Tree of proxies (subtree of component properties).
 */
export type ProxyTree = TreeWithChildrenHashAndParent<{proxy: ProxyObject; slots: undefined}>;

/**
 * Key of `target` in proxy object.
 */
export declare const PROXY_TARGET_KEY: unique symbol;

/**
 * List of all slots for concrete value (path) in properties.
 */
export type Slots = MaybeArray<AttributeSlot | ChildSlot>;

/**
 * Tree of slots (subtree of component properties).
 */
export type SlotsTree = Tree<{slots: Slots}>;

/**
 * Inner key for brand types.
 */
declare const BRAND: unique symbol;

/**
 * Not empty array or `undefined`.
 */
type MaybeArray<Element> = readonly [Element, ...Element[]] | undefined;

/**
 * Defines preslot for some slot.
 */
type Preslot<Slot extends {node: NodeIndex}> = Omit<Slot, 'node'> & Readonly<{node: number}>;

/**
 * Renders one type of slots.
 */
type RenderSlot<Fields extends object> = (this: void, slot: Slot<Fields>, value: unknown) => void;

/**
 * Defines some slot.
 */
type Slot<Fields extends object> = Readonly<{node: NodeIndex; render: RenderSlot<Fields>}> & Fields;

/**
 * General tree.
 */
type Tree<Properties extends object, Key extends string | symbol = string | symbol> = Readonly<
  {children: MaybeArray<Tree<Properties, Key>>; key: Key} & Properties
>;

/**
 * General tree with children hash (`childrenByKey`) and `string | symbol` keys.
 */
type TreeWithChildrenHash<Properties extends object> = Tree<
  {
    childrenByKey: Readonly<Record<string | symbol, TreeWithChildrenHash<Properties>>> | undefined;
  } & Properties,
  string | symbol
>;

/**
 * General tree with children hash and links to parent nodes.
 */
type TreeWithChildrenHashAndParent<Properties extends object> = TreeWithChildrenHash<
  {parent: TreeWithChildrenHashAndParent<Properties> | undefined} & Properties
>;
