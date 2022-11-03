import { createRenderer } from 'solid-js/universal';

const PROPERTIES = new Set(['className', 'textContent']);

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
    createElement(type, props, parent) {
        return $.CreatePanel(type, $.GetContextPanel(), '');
    },
    createTextNode(value) {
        return $.CreatePanelWithProperties('Label', $.GetContextPanel(), '', {
            text: value
        });
    },
    replaceText(textNode, value) {},
    setProperty(node, name, value) {},
    insertNode(parent, node, anchor) {},
    isTextNode(node) {
        return node.paneltype === 'Label';
    },
    removeNode(parent, node) {},
    getParentNode(node: Panel) {
        if (!node) {
            return;
        }
        const parent = node.GetParent();
        if (parent) {
            return parent;
        }
    },
    getFirstChild(node) {
        const child = node.GetChild(0);
        if (!child) {
            return;
        }
        return child;
    },
    getNextSibling(node) {
        const child = node.GetChild(0);
        if (!child) {
            return;
        }
        return child;
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
