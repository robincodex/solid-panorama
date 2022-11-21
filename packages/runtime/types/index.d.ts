/// <reference path="./style.d.ts" />
/// <reference path="./utils.d.ts" />
/// <reference path="./attributes.d.ts" />

import { Renderer } from 'solid-js/universal/types/universal';
import './elements';

export function useGameEvent<
    T extends keyof GameEventDeclarations,
    D extends NetworkedData<GameEventDeclarations[T]>
>(eventName: T, callback: (event: D) => void, deps?: any): void;
export function useGameEvent<
    T extends keyof CustomGameEventDeclarations,
    D extends NetworkedData<CustomGameEventDeclarations[T]>
>(eventName: T, callback: (event: D) => void, deps?: any): void;

export const {
    render,
    effect,
    memo,
    createComponent,
    createElement,
    createTextNode,
    insertNode,
    insert,
    spread,
    setProp,
    mergeProps
}: Renderer<Panel>;

export {
    For,
    Show,
    Suspense,
    SuspenseList,
    Switch,
    Match,
    Index,
    ErrorBoundary
} from 'solid-js';

declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            root: {};
            styles: {};
            scripts: {};
            include: { src: string };
            snippets: {};
            snippet: { name: string };
        }
    }
}
