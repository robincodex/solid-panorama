/// <reference path="./style.d.ts" />
/// <reference path="./utils.d.ts" />
/// <reference path="./attributes.d.ts" />
/// <reference path="./jsx.d.ts" />

import { Accessor, ComponentProps, ValidComponent } from 'solid-js';
import { Renderer } from 'solid-js/universal/types/universal';
import './elements';

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

export type DynamicProps<T extends ValidComponent, P = ComponentProps<T>> = {
    [K in keyof P]: P[K];
} & {
    component: T | undefined;
};

/**
 * Note: Copy from solid-js/types/jsx.d.ts
 *
 * renders an arbitrary custom or native component and passes the other props
 * ```typescript
 * <Dynamic component={isLabel? 'Panel' : 'Label'} text={value()} />
 * ```
 * @description https://www.solidjs.com/docs/latest/api#dynamic
 */
export function Dynamic<T extends ValidComponent>(
    props: DynamicProps<T>
): Accessor<JSX.Element>;

declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            root: { children?: any };
            styles: { children?: any };
            scripts: { children?: any };
            include: { src: string };
            snippets: { children?: any };
            snippet: { name: string; children?: any };
        }
    }
}
