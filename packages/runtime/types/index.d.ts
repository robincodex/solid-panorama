/// <reference path="./style.d.ts" />
/// <reference path="./utils.d.ts" />
/// <reference path="./attributes.d.ts" />

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
