/// <reference path="../types/jsx.d.ts" />

import {
    Accessor,
    ComponentProps,
    createMemo,
    splitProps,
    untrack,
    ValidComponent
} from 'solid-js';
import { createRenderer } from 'solid-js/universal';
import { StyleKeyAutoConvertToPixelList } from './config';
import { setDragEvent } from './event';
import {
    setCustomTooltip,
    setCustomTooltipParams,
    setTooltipText
} from './tooltip';

// Forward Solid control flow
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

const hasOwn = Object.prototype.hasOwnProperty;

/** The deleted node will be moved to trash and then delete it */
const nodeTrash = (function () {
    let root = $.GetContextPanel();
    while (root.GetParent()) {
        root = root.GetParent()!;
    }
    return $.CreatePanel('Panel', root, '', {
        style: 'visibility: collapse;'
    });
})();

export const {
    render: _render,
    effect,
    memo,
    createComponent,
    createElement,
    createTextNode,
    insertNode,
    insert,
    spread,
    setProp,
    mergeProps,
    // @ts-ignore
    use
} = createRenderer<Panel>({
    // @ts-ignore
    createElement(type: string, props: any, parent?: Panel) {
        const {
            id,
            snippet,
            vars,
            dialogVariables,
            text,
            style,
            visible,
            ..._props
        } = props;
        const styleIsString = typeof style === 'string';
        if (styleIsString) {
            props.style = style;
        }
        const el = $.CreatePanel(
            type,
            parent || $.GetContextPanel(),
            id || '',
            _props
        ) as LabelPanel;
        if (visible === false) {
            el.visible = false;
        }
        el.SetDisableFocusOnMouseDown(true);
        if (!styleIsString) {
            applyStyles(el, style);
        }
        if (snippet) {
            el.BLoadLayoutSnippet(snippet);
        }
        if (vars) {
            setDialogVariables(el, vars, {});
        }
        if (dialogVariables) {
            setDialogVariables(el, dialogVariables, {});
        }
        if (text) {
            if (text[0] === '#') {
                el.__solidText = text;
                el.text = $.Localize(text, el);
            } else {
                el.text = text;
            }
        }
        return el;
    },
    // @ts-ignore
    createTextNode(value: string, parent?: Panel) {
        if (typeof value !== 'string') {
            value = String(value);
        }
        if (value[0] === '#') {
            value = $.Localize(value, parent);
        }
        const child = $.CreatePanel(
            'Label',
            parent || $.GetContextPanel(),
            '',
            {
                text: value,
                html: 'true'
            }
        );
        child.SetDisableFocusOnMouseDown(true);
        if (value[0] === '#') {
            child.__solidText = value;
        }
        return child;
    },

    replaceText(textNode: LabelPanel, value) {
        if (!textNode || !textNode.IsValid()) {
            return;
        }
        if (value[0] === '#') {
            textNode.__solidText = value;
            value = $.Localize(value, textNode);
        }
        textNode.text = value;
    },

    isTextNode(node: LabelPanel) {
        if (!node || !node.IsValid()) {
            return false;
        }
        return node.paneltype === 'Label';
    },

    insertNode(parent: Panel, node: Panel, anchor?: Panel) {
        if (!parent || !parent.IsValid() || !node || !node.IsValid()) {
            return;
        }
        node.SetParent(parent);
        if (anchor && anchor.IsValid()) {
            parent.MoveChildBefore(node, anchor);
        }
    },

    removeNode(parent: Panel, node: Panel) {
        if (!parent || !parent.IsValid() || !node || !node.IsValid()) {
            return;
        }
        node.SetParent(nodeTrash);
        node.DeleteAsync(0);
    },

    getParentNode(node: Panel) {
        if (!node || !node.IsValid()) {
            return;
        }
        const parent = node.GetParent();
        if (parent) {
            return parent;
        }
    },
    getFirstChild(node: Panel) {
        if (!node || !node.IsValid()) {
            return;
        }
        const child = node.GetChild(0);
        if (!child) {
            return;
        }
        return child;
    },
    getNextSibling(node: Panel) {
        if (!node || !node.IsValid()) {
            return;
        }
        const parent = node.GetParent();
        if (!parent) {
            return;
        }
        const el = parent.GetChild(parent.GetChildIndex(node) + 1);
        if (!el) {
            return;
        }
        return el;
    },

    setProperty(node: Panel, name, value: any, prev?: any) {
        if (!node || !node.IsValid()) {
            return;
        }
        // id is readonly
        if (name === 'id') {
            return;
        }
        if (name === 'class' || name === 'className') {
            applyClassNames(node, value, prev || '');
        } else if (name === 'text') {
            if (value[0] === '#') {
                node.__solidText = value;
                (node as LabelPanel).text = $.Localize(value, node);
            } else {
                (node as LabelPanel).text = value;
            }
        } else if (name === 'src' && (node as ImagePanel).SetImage) {
            (node as ImagePanel).SetImage(value);
        } else if (name === 'classList') {
            updateClassList(node, value, prev);
        } else if (name === 'style') {
            applyStyles(node, value, prev);
        } else if (name === 'vars' || name === 'dialogVariables') {
            setDialogVariables(node, value, prev);
        } else if (name === 'attrs') {
            setAttributes(node, value);
        } else if (name === 'inputnamespace') {
            node.SetInputNamespace(value || '');
        } else if (name === 'draggable') {
            node.SetDraggable(value === true);
        } else if (name === 'acceptsfocus') {
            node.SetAcceptsFocus(value === true);
        } else if (name === 'tooltip_text') {
            setTooltipText(node, value);
        } else if (name === 'custom_tooltip') {
            setCustomTooltip(node, value);
        } else if (name === 'custom_tooltip_params') {
            setCustomTooltipParams(node, value);
        } else if (
            name === 'onDragStart' ||
            name === 'onDragEnd' ||
            name === 'onDragEnter' ||
            name === 'onDragDrop' ||
            name === 'onDragLeave'
        ) {
            setDragEvent(node, name, value);
        } else if (name.startsWith('data-')) {
            setData(node, name.slice(5), value);
        } else if (name.startsWith('on')) {
            setPanelEvent(node, name as PanelEvent, value);
        } else {
            if (hasOwn.call(node, name)) {
                // @ts-ignore
                node[name] = value;
            } else {
                node.SetAttributeString(name, String(value));
            }
        }
    }
});

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
): Accessor<JSX.Element> {
    const [p, others] = splitProps(props, ['component']);
    const cached = createMemo<Function | string>(() => p.component);
    return createMemo(() => {
        const component = cached();
        switch (typeof component) {
            case 'function':
                return untrack(() => component(others));

            case 'string':
                const el = createElement(component);
                spread(el, others);
                return el;

            default:
                break;
        }
    });
}

declare global {
    interface Panel {
        __solidDisposer?: () => void;
        __solidText?: string;
    }
}

export function render(code: () => any, container: Panel) {
    if (container.__solidDisposer) {
        container.__solidDisposer();
        container.RemoveAndDeleteChildren();
    }
    Object.defineProperty(container, '__solidDisposer', {
        configurable: true,
        value: _render(code, container)
    });
    return container.__solidDisposer;
}

const splitClassName = /\s+/;

function applyClassNames(node: Panel, names: string, prev: string) {
    const nameList = names.split(splitClassName);
    const oldList = prev.split(splitClassName);
    for (let i = oldList.length - 1; i >= 0; i--) {
        const name = oldList[i];
        if (nameList.includes(name)) {
            continue;
        } else {
            node.RemoveClass(name);
        }
    }
    for (const name of nameList) {
        node.AddClass(name);
    }
}

function updateClassList(
    node: Panel,
    state: Record<string, boolean>,
    prev?: Record<string, boolean>
) {
    if (prev) {
        for (const k in prev) {
            if (state[k] === undefined) {
                node.RemoveClass(k);
            }
        }
    }
    for (const k in state) {
        node.SetHasClass(k, state[k] === true);
    }
}

function applyStyles(
    node: Panel,
    styles: Record<string, string | number>,
    prev?: Record<string, string | number>
) {
    prev = prev || {};
    for (const k in prev) {
        if (!hasOwn.call(styles, k)) {
            node.style[k as keyof VCSSStyleDeclaration] = null;
        }
    }
    for (const k in styles) {
        if (typeof styles[k] === 'number') {
            if (StyleKeyAutoConvertToPixelList.includes(k)) {
                // @ts-ignore
                node.style[k] = `${styles[k]}px`;
                continue;
            }
        }
        // @ts-ignore
        node.style[k] = styles[k];
    }
}

function setPanelEvent(node: Panel, event: PanelEvent, handle: any) {
    if (!handle) {
        node.ClearPanelEvent(event);
        return;
    }
    node.SetPanelEvent(event, function () {
        handle(node);
    });
}

const PANORAMA_INVALID_DATE = 2 ** 52;

function setDialogVariables(
    node: Panel,
    vars: Record<string, string | number | Date>,
    prev?: Record<string, string | number | Date>
) {
    prev = prev || {};
    for (const key in prev) {
        if (!vars[key]) {
            const value = prev[key];
            if (typeof value === 'string') {
                node.SetDialogVariable(key, `[!s:${key}]`);
            } else if (typeof value === 'number') {
                node.SetDialogVariableInt(key, NaN);
            } else {
                node.SetDialogVariableTime(key, PANORAMA_INVALID_DATE);
            }
        }
    }
    for (const key in vars) {
        const value = vars[key];
        if (typeof value === 'string') {
            if (value[0] === '#') {
                node.SetDialogVariableLocString(key, value);
            } else {
                node.SetDialogVariable(key, value);
            }
        } else if (typeof value === 'number') {
            node.SetDialogVariableInt(key, value);
        } else {
            node.SetDialogVariableTime(key, Math.floor(value.getTime() / 1000));
        }
    }
    if (node.__solidText) {
        (node as LabelPanel).text = $.Localize(node.__solidText, node);
    }
}

function setAttributes(node: Panel, attrs: Record<string, string | number>) {
    for (const key in attrs) {
        const value = attrs[key];
        if (typeof value === 'number') {
            node.SetAttributeInt(key, value);
        } else {
            node.SetAttributeString(key, value);
        }
    }
}

function setData(node: Panel, key: string, v: unknown) {
    if (!node.Data) {
        const data: object = {};
        Object.defineProperty(node, 'Data', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function () {
                return data;
            }
        });
    }
    (node.Data() as any)[key] = v;
}
