import { createRenderer } from 'solid-js/universal';
import { StyleKeyAutoConvertToPixelList } from './config';

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
} = createRenderer({
    // @ts-ignore
    createElement(type: string, props: any, parent?: Panel) {
        const { id, snippet, vars, dialogVariables, text, ..._props } = props;
        const el = $.CreatePanelWithProperties(
            type,
            parent || $.GetContextPanel(),
            id || '',
            _props
        );
        if (vars) {
            setDialogVariables(el, vars, {});
        }
        if (dialogVariables) {
            setDialogVariables(el, dialogVariables, {});
        }
        if (text && el.paneltype === 'Label') {
            if (text[0] === '#') {
                (el as LabelPanel).text = $.Localize(text, el);
            } else {
                (el as LabelPanel).text = text;
            }
        }
        if (snippet) {
            el.BLoadLayoutSnippet(snippet);
        }
        return el;
    },
    // @ts-ignore
    createTextNode(value: string, parent?: Panel) {
        if (typeof value !== 'string') {
            value = String(value);
        }
        if (value[0] === '#') {
            value = $.Localize(value);
        }
        return $.CreatePanelWithProperties(
            'Label',
            parent || $.GetContextPanel(),
            '',
            {
                text: value,
                html: 'true'
            }
        );
    },

    replaceText(textNode: LabelPanel, value) {
        if (!textNode || !textNode.IsValid()) {
            return;
        }
        if (value[0] === '#') {
            value = $.Localize(value);
        }
        textNode.text = value;
    },

    isTextNode(node: LabelPanel) {
        if (!node || !node.IsValid()) {
            return false;
        }
        return node.paneltype === 'Label';
    },

    setProperty(node: Panel, name, value: any, prev?: any) {
        if (!node || !node.IsValid()) {
            return;
        }
        if (name === 'class' || name === 'className') {
            applyClassNames(node, value, prev || '');
        } else if (name === 'classList') {
            updateClassList(node, value);
        } else if (name === 'style') {
            applyStyles(node, value, prev);
        } else if (name === 'vars' || name === 'dialogVariables') {
            setDialogVariables(node, value, prev);
        } else if (name === 'inputnamespace') {
            node.SetInputNamespace(value || '');
        } else if (name.startsWith('on')) {
            setPanelEvent(node, name as PanelEvent, value);
        } else {
            node.SetAttributeString(name, String(value));
        }
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
        return parent.GetChild(parent.GetChildIndex(node) + 1);
    }
});

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

function updateClassList(node: Panel, state: Record<string, boolean>) {
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
        if (!styles[k]) {
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
            throw new Error(`style key ${k} not support number`);
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
}
