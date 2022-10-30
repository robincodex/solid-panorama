import { JSX } from './jsx.js';
export const Aliases: Record<string, string>;
export const PropAliases: Record<string, string>;
export const Properties: Set<string>;
export const ChildProperties: Set<string>;
export const DelegatedEvents: Set<string>;
export const DOMElements: Set<string>;
export const SVGElements: Set<string>;
export const SVGNamespace: Record<string, string>;

type MountableElement = Panel;
export function render(
    code: () => JSX.Element,
    element: MountableElement
): () => void;
export function template(html: string, count: number, isSVG?: boolean): Panel;
export function effect<T>(fn: (prev?: T) => T, init?: T): void;
export function memo<T>(fn: () => T, equal: boolean): () => T;
export function untrack<T>(fn: () => T): T;
export function insert<T>(
    parent: MountableElement,
    accessor: (() => T) | T,
    marker?: Panel | null,
    init?: JSX.Element
): JSX.Element;
export function createComponent<T>(
    Comp: (props: T) => JSX.Element,
    props: T
): JSX.Element;
export function delegateEvents(eventNames: string[], d?: Panel): void;
export function clearDelegatedEvents(d?: Panel): void;
export function spread<T>(
    node: Panel,
    accessor: (() => T) | T,
    isSVG?: Boolean,
    skipChildren?: Boolean
): void;
export function assign(
    node: Panel,
    props: any,
    isSVG?: Boolean,
    skipChildren?: Boolean
): void;
export function setAttribute(node: Panel, name: string, value: string): void;
export function setAttributeNS(
    node: Panel,
    namespace: string,
    name: string,
    value: string
): void;
export function className(node: Panel, value: string): void;
export function innerHTML(node: Panel, content: string): void;
export function addEventListener(
    node: Panel,
    name: string,
    handler: () => void,
    delegate: boolean
): void;
export function classList(
    node: Panel,
    value: { [k: string]: boolean },
    prev?: { [k: string]: boolean }
): void;
export function style(
    node: Panel,
    value: { [k: string]: string },
    prev?: { [k: string]: string }
): void;
export function getOwner(): unknown;
export function mergeProps(...sources: unknown[]): unknown;
export function dynamicProperty(props: unknown, key: string): unknown;

export function hydrate(
    fn: () => JSX.Element,
    node: MountableElement,
    options?: { renderId?: string; owner?: unknown }
): () => void;
export function getHydrationKey(): string;
export function getNextElement(template?: Panel): Panel;
export function getNextMatch(start: Panel, elementName: string): Panel;
export function getNextMarker(start: Panel): [Panel, Array<Panel>];
export function useAssets(fn: () => JSX.Element): void;
export function getAssets(): string;
export function HydrationScript(): JSX.Element;
export function generateHydrationScript(): string;
export function Assets(props: { children?: JSX.Element }): JSX.Element;
export function Hydration(props: { children?: JSX.Element }): JSX.Element;
export function NoHydration(props: { children?: JSX.Element }): JSX.Element;
