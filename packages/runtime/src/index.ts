import { createRenderer } from 'solid-js/universal';

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
        const { id, ..._props } = props;
        return $.CreatePanelWithProperties(
            type,
            parent || $.GetContextPanel(),
            id || '',
            _props
        );
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
