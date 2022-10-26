/// <reference path="../node_modules/@moddota/panorama-types/index.d.ts" />
//@ts-check

import {
    Properties,
    ChildProperties,
    Aliases,
    PropAliases,
    SVGNamespace,
    DelegatedEvents
} from './constants';
import {
    root,
    effect,
    memo,
    getOwner,
    createComponent,
    sharedConfig,
    untrack,
    mergeProps
    //@ts-ignore
} from 'rxcore';
import reconcileArrays from './reconcile';
export {
    Properties,
    ChildProperties,
    PropAliases,
    Aliases,
    DOMElements,
    SVGElements,
    SVGNamespace,
    DelegatedEvents
} from './constants';

const $$EVENTS = '_$DX_DELEGATE';
const $$CLASSNAME = '_$CLASSNAME';

export {
    effect,
    memo,
    untrack,
    getOwner,
    createComponent,
    mergeProps,
    voidFn as useAssets,
    voidFn as getAssets,
    voidFn as Assets,
    voidFn as generateHydrationScript,
    voidFn as HydrationScript
};

/**
 * @param {Function} code
 * @param {Panel} element
 * @param {Panel[]} init
 * @param {object} options
 */
export function render(code, element, init, options = {}) {
    let disposer;
    root(dispose => {
        disposer = dispose;
        insert(element, code(), element.GetChild(0) ? null : undefined, init);
    }, options.owner);
    return () => {
        disposer();
    };
}

export function template() {
    throw new Error('Not support html template');
}

export function delegateEvents() {
    throw new Error('Not support delegateEvents');
}

export function clearDelegatedEvents() {
    throw new Error('Not support clearDelegatedEvents');
}

/**
 * @param {Panel} node
 * @param {string} name
 * @param {any} value
 */
export function setAttribute(node, name, value) {
    if (value == null) node.SetAttributeString(name, '');
    else node.SetAttributeString(name, String(value));
}

export function setAttributeNS() {
    throw new Error('Not support setAttributeNS');
}

/**
 * @param {Panel} panel
 */
function removeClassName(panel) {
    if (!panel.hasOwnProperty($$CLASSNAME)) {
        return;
    }
    const oldStyles = panel[$$CLASSNAME];
    for (const v of oldStyles) {
        panel.RemoveClass(v);
    }
}

const _splitClassName = /\s+/;

/**
 * @param {Panel} panel
 * @param {string} value
 */
function applyClassName(panel, value) {
    if (!panel.hasOwnProperty($$CLASSNAME)) {
        Object.defineProperty(panel, $$CLASSNAME, {
            value: new Set(),
            configurable: true
        });
    }
    /** @type Set<string> */
    const oldStyles = panel[$$CLASSNAME];
    const newStyles = new Set(value.trim().split(_splitClassName));
    for (const v of newStyles) {
        if (!oldStyles.has(v)) {
            panel.AddClass(v);
            oldStyles.delete(v);
        }
    }
    for (const v of oldStyles) {
        if (!newStyles.has(v)) {
            panel.RemoveClass(v);
        }
    }
    Object.defineProperty(panel, $$CLASSNAME, {
        value: newStyles,
        configurable: true
    });
}

/**
 * @param {Panel} node
 * @param {string} value
 */
export function className(node, value) {
    if (value == null) {
        removeClassName(node);
    } else {
        applyClassName(node, value);
    }
}

/**
 * @param {Panel} node
 * @param {PanelEvent} name
 * @param {() => void} handler
 */
export function addEventListener(node, name, handler) {
    node.SetPanelEvent(name, handler);
}

/**
 * @param {Panel} node
 * @param {Record<string, any>} value
 * @param {Record<string, any>} prev
 */
export function classList(node, value, prev = {}) {
    const classKeys = Object.keys(value || {}),
        prevKeys = Object.keys(prev);
    let i, len;
    for (i = 0, len = prevKeys.length; i < len; i++) {
        const key = prevKeys[i];
        if (!key || key === 'undefined' || value[key]) continue;
        toggleClassKey(node, key, false);
        delete prev[key];
    }
    for (i = 0, len = classKeys.length; i < len; i++) {
        const key = classKeys[i],
            classValue = !!value[key];
        if (
            !key ||
            key === 'undefined' ||
            prev[key] === classValue ||
            !classValue
        )
            continue;
        toggleClassKey(node, key, true);
        prev[key] = classValue;
    }
    return prev;
}

/**
 * @param {Panel} node
 * @param {string} key
 */
function removeStyleKey(node, key) {
    node.style[key] = null;
}

/**
 * @param {string} style
 */
function parseStyle(style) {
    let result = {};
    const values = style
        .split(';')
        .map(v => v.trim())
        .filter(v => v !== '');
    for (const v of values) {
        const i = v.indexOf(':');
        const key = v.slice(0, i).trim();
        const value = v.slice(i + 1).trim();
        result[key] = value;
    }
    return result;
}

/**
 * @param {Panel} node
 * @param {*} value
 * @param {*} prev
 */
export function style(node, value, prev) {
    if (typeof prev === 'string') {
        prev = parseStyle(prev);
    }
    if (!value) {
        if (prev) {
            for (const k in prev) {
                removeStyleKey(node, k);
            }
        }
        return value;
    }
    if (typeof value === 'string') {
        value = parseStyle(value);
    }
    const nodeStyle = node.style;
    prev || (prev = {});
    value || (value = {});
    let v, s;
    for (s in prev) {
        value[s] == null && removeStyleKey(node, s);
        delete prev[s];
    }
    for (s in value) {
        v = value[s];
        if (v !== prev[s]) {
            nodeStyle[s] = v;
            prev[s] = v;
        }
    }
    return prev;
}

/**
 * @param {Panel} node
 * @param {*} props
 * @param {boolean} isSVG
 * @param {boolean} skipChildren
 * @returns
 */
export function spread(node, props = {}, isSVG, skipChildren) {
    const prevProps = {};
    if (!skipChildren) {
        effect(
            () =>
                (prevProps.children = insertExpression(
                    node,
                    props.children,
                    prevProps.children
                ))
        );
    }
    effect(() => props.ref && props.ref(node));
    effect(() => assign(node, props, isSVG, true, prevProps, true));
    return prevProps;
}

/**
 * @param {*} props
 * @param {string} key
 */
export function dynamicProperty(props, key) {
    const src = props[key];
    Object.defineProperty(props, key, {
        get() {
            return src();
        },
        enumerable: true
    });
    return props;
}

/**
 * @param {Panel} parent
 * @param {string} content
 */
export function innerHTML(parent, content) {
    throw new Error('Not support innerHTML');
}

/**
 * @param {Function} fn
 * @param {Panel} element
 * @param {*} arg
 */
export function use(fn, element, arg) {
    return untrack(() => fn(element, arg));
}

/**
 * @param {Panel} parent
 * @param {*} accessor
 * @param {*} marker
 * @param {*} initial
 */
export function insert(parent, accessor, marker, initial) {
    if (marker !== undefined && !initial) initial = [];
    if (typeof accessor !== 'function')
        return insertExpression(parent, accessor, initial, marker);
    effect(
        current => insertExpression(parent, accessor(), current, marker),
        initial
    );
}

/**
 * @param {Panel} node
 * @param {*} props
 * @param {boolean} isSVG
 * @param {boolean} skipChildren
 * @param {*} prevProps
 * @param {boolean} skipRef
 */
export function assign(
    node,
    props,
    isSVG,
    skipChildren,
    prevProps = {},
    skipRef = false
) {
    props || (props = {});
    for (const prop in prevProps) {
        if (!(prop in props)) {
            if (prop === 'children') continue;
            prevProps[prop] = assignProp(
                node,
                prop,
                null,
                prevProps[prop],
                isSVG,
                skipRef
            );
        }
    }
    for (const prop in props) {
        if (prop === 'children') {
            if (!skipChildren) insertExpression(node, props.children);
            continue;
        }
        const value = props[prop];
        prevProps[prop] = assignProp(
            node,
            prop,
            value,
            prevProps[prop],
            isSVG,
            skipRef
        );
    }
}

/**
 * @param {*} code
 * @param {Panel} element
 * @param {*} options
 */
export function hydrate(code, element, options = {}) {
    throw new Error('Not support ssr: hydrate');
}

export function getNextElement(template) {
    let node, key;
    if (
        !sharedConfig.context ||
        !(node = sharedConfig.registry.get((key = getHydrationKey())))
    ) {
        if ('_DX_DEV_' && sharedConfig.context)
            console.warn('Unable to find DOM nodes for hydration key:', key);
        if ('_DX_DEV_' && !template)
            throw new Error(
                'Unrecoverable Hydration Mismatch. No template for key: ' + key
            );
        return template.cloneNode(true);
    }
    if (sharedConfig.completed) sharedConfig.completed.add(node);
    sharedConfig.registry.delete(key);
    return node;
}

/**
 * @param {Panel} node
 */
function getPanelNextSibling(node) {
    if (!node || !node.IsValid()) {
        return;
    }
    const parent = node.GetParent();
    if (!parent || !parent.IsValid()) {
        return;
    }
    return node.GetChild(parent.GetChildIndex(node) + 1);
}

/**
 * @param {Panel | null | undefined} el
 * @param {string} nodeName
 */
export function getNextMatch(el, nodeName) {
    while (el && el.paneltype !== nodeName) el = getPanelNextSibling(el);
    return el;
}

export function getNextMarker(start) {
    let end = start,
        count = 0,
        current = [];
    if (sharedConfig.context) {
        while (end) {
            if (end.nodeType === 8) {
                const v = end.nodeValue;
                if (v === '#') count++;
                else if (v === '/') {
                    if (count === 0) return [end, current];
                    count--;
                }
            }
            current.push(end);
            end = end.nextSibling;
        }
    }
    return [end, current];
}

export function runHydrationEvents() {
    throw new Error('Not support ssr: runHydrationEvents');
}

/**
 * Internal Functions
 * @param {string} name
 */
function toPropertyName(name) {
    return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
}

/**
 * @param {Panel} node
 * @param {string} key
 * @param {boolean} value
 */
function toggleClassKey(node, key, value) {
    const classNames = key.trim().split(_splitClassName);
    for (let i = 0, nameLen = classNames.length; i < nameLen; i++)
        node.SetHasClass(classNames[i], value);
}

/**
 * @param {Panel} node
 * @param {string} prop
 * @param {*} value
 * @param {*} prev
 * @param {boolean} isSVG
 * @param {boolean} skipRef
 */
function assignProp(node, prop, value, prev, isSVG, skipRef) {
    if (isSVG) {
        throw new Error('Not support svg');
    }
    let isProp, isChildProp;
    if (prop === 'style') return style(node, value, prev);
    if (prop === 'classList') return classList(node, value, prev);
    if (value === prev) return prev;
    if (prop === 'ref') {
        if (!skipRef) value(node);
    } else if (prop.slice(0, 3) === 'on:') {
        /** @type any */
        const e = 'on' + prop.slice(3);
        node.ClearPanelEvent(e);
        value && node.SetPanelEvent(e, value);
    } else if (prop.slice(0, 10) === 'oncapture:') {
        throw new Error('Not support capture event');
    } else if (prop.slice(0, 2) === 'on') {
        /** @type any */
        const name = 'on' + prop.slice(2).toLowerCase();
        const delegate = DelegatedEvents.has(name);
        if (!delegate && prev) {
            node.ClearPanelEvent(name);
        }
        if (delegate || value) {
            addEventListener(node, name, value);
        }
    } else if (
        (isChildProp = ChildProperties.has(prop)) ||
        (!isSVG && (PropAliases[prop] || (isProp = Properties.has(prop))))
    ) {
        if (prop === 'class' || prop === 'className') className(node, value);
        else node[PropAliases[prop] || prop] = value;
    } else {
        setAttribute(node, Aliases[prop] || prop, value);
    }
    return value;
}

function eventHandler(panel) {
    // 这里应该是实现冒泡事件，与PUI不兼容，待定
}

/**
 * @param {Panel} parent
 * @param {*} value
 * @param {*=} current
 * @param {*=} marker
 * @param {*=} unwrapArray
 */
function insertExpression(parent, value, current, marker, unwrapArray) {
    while (typeof current === 'function') current = current();
    if (value === current) return current;
    const t = typeof value,
        multi = marker !== undefined;
    parent = (multi && current[0] && current[0].parentNode) || parent;

    if (t === 'string' || t === 'number') {
        if (t === 'number') value = value.toString();
        if (multi) {
            let node = current[0];
            if (node && node.nodeType === 3) {
                node.data = value;
            } else node = document.createTextNode(value);
            current = cleanChildren(parent, current, marker, node);
        } else {
            current = value;
            // @ts-ignore
            parent.text = value;
        }
    } else if (value == null || t === 'boolean') {
        current = cleanChildren(parent, current, marker);
    } else if (t === 'function') {
        effect(() => {
            let v = value();
            while (typeof v === 'function') v = v();
            current = insertExpression(parent, v, current, marker);
        });
        return () => current;
    } else if (Array.isArray(value)) {
        const array = [];
        const currentArray = current && Array.isArray(current);
        if (normalizeIncomingArray(array, value, current, unwrapArray)) {
            effect(
                () =>
                    (current = insertExpression(
                        parent,
                        array,
                        current,
                        marker,
                        true
                    ))
            );
            return () => current;
        }
        if (sharedConfig.context) {
            if (!array.length) return current;
            for (let i = 0; i < array.length; i++) {
                if (array[i].parentNode) return (current = array);
            }
        }
        if (array.length === 0) {
            current = cleanChildren(parent, current, marker);
            if (multi) return current;
        } else if (currentArray) {
            if (current.length === 0) {
                appendNodes(parent, array, marker);
            } else reconcileArrays(parent, current, array);
        } else {
            current && cleanChildren(parent);
            appendNodes(parent, array);
        }
        current = array;
    } else if (value instanceof Node) {
        if (sharedConfig.context && value.parentNode)
            return (current = multi ? [value] : value);
        if (Array.isArray(current)) {
            if (multi)
                return (current = cleanChildren(
                    parent,
                    current,
                    marker,
                    value
                ));
            cleanChildren(parent, current, null, value);
        } else if (current == null || current === '' || !parent.firstChild) {
            parent.appendChild(value);
        } else parent.replaceChild(value, parent.firstChild);
        current = value;
    } else if ('_DX_DEV_')
        console.warn(`Unrecognized value. Skipped inserting`, value);

    return current;
}

function normalizeIncomingArray(normalized, array, current, unwrap) {
    let dynamic = false;
    for (let i = 0, len = array.length; i < len; i++) {
        let item = array[i],
            prev = current && current[i],
            t;
        if (item instanceof Node) {
            normalized.push(item);
        } else if (item == null || item === true || item === false) {
            // matches null, undefined, true or false
            // skip
        } else if (Array.isArray(item)) {
            dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
        } else if ((t = typeof item) === 'function') {
            if (unwrap) {
                while (typeof item === 'function') item = item();
                dynamic =
                    normalizeIncomingArray(
                        normalized,
                        Array.isArray(item) ? item : [item],
                        Array.isArray(prev) ? prev : [prev]
                    ) || dynamic;
            } else {
                normalized.push(item);
                dynamic = true;
            }
        } else {
            // NOTE: is String better than `item + ''`, ``${item}``, `item.toString()` and `item.valueOf()`?
            const value = String(item);
            if (prev && prev.nodeType === 3 && prev.data === value) {
                normalized.push(prev);
            } else normalized.push(document.createTextNode(value));
        }
    }
    return dynamic;
}

/**
 * @param {Panel} parent
 * @param {Panel[]} array
 * @param {Panel | null} [marker=null]
 */
function appendNodes(parent, array, marker = null) {
    for (let i = 0, len = array.length; i < len; i++) {
        array[i].SetParent(parent);
        if (marker) {
            parent.MoveChildBefore(array[i], marker);
        }
    }
}

/**
 * @param {Panel} parent
 * @param {Panel | Panel[] =} current
 * @param {*=} marker
 * @param {*=} replacement
 * @returns
 */
function cleanChildren(parent, current, marker, replacement) {
    if (marker === undefined) {
        parent.RemoveAndDeleteChildren();
        return [];
    }
    if (replacement) {
        replacement.SetParent(parent);
        if (marker) {
            parent.MoveChildBefore(replacement, marker);
        }
        return [replacement];
    }
    return [];
}

export function getHydrationKey() {
    const hydrate = sharedConfig.context;
    return `${hydrate.id}${hydrate.count++}`;
}

export function NoHydration(props) {
    return sharedConfig.context ? undefined : props.children;
}

export function Hydration(props) {
    return props.children;
}

function voidFn() {}
