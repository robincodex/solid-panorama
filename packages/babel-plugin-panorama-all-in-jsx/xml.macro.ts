// @ts-check
import { createMacro } from 'babel-plugin-macros';
import * as t from '@babel/types';
import xmljs from 'xml-js';

const xmlCache: Record<string, xmljs.Element> = {};

export default createMacro(function ({ references, state, babel }) {
    if (!state.filename) {
        return;
    }
    for (const path of references.default) {
        if (!path.parentPath || !path.parentPath.isCallExpression()) {
            path.parentPath?.remove();
            continue;
        }
        const el = path.parentPath.node.arguments[0];
        if (!el || !t.isJSXElement(el)) {
            path.parentPath?.remove();
            continue;
        }
        const result = convertJSXtoXML(el);
        xmlCache[state.filename] = result;
        path.parentPath?.remove();
    }
});

export function getXML(filename: string): xmljs.Element | undefined {
    return xmlCache[filename];
}

export function getAllCacheXML(): Record<string, xmljs.Element> {
    return xmlCache;
}

export function formatXML(root: xmljs.Element): string {
    return xmljs.js2xml({ elements: [root] }, { compact: false, spaces: '  ' });
}

/**
 * convert jsx to xml
 */
function convertJSXtoXML(root: t.JSXElement): xmljs.Element {
    const el: xmljs.Element = { type: 'element' };
    const node = root.openingElement.name;
    let rootName: string = '';
    if (t.isJSXIdentifier(node)) {
        rootName = node.name;
    }
    const attrs: xmljs.Attributes = {};
    el.name = rootName;
    el.attributes = attrs;

    for (const attrNode of root.openingElement.attributes) {
        if (t.isJSXAttribute(attrNode) && attrNode.value) {
            if (
                t.isJSXIdentifier(attrNode.name) &&
                t.isStringLiteral(attrNode.value)
            ) {
                attrs[attrNode.name.name] = attrNode.value.value;
            }
        }
    }

    if (root.children.length > 0) {
        const children: xmljs.Element[] = [];
        el.elements = children;

        for (const child of root.children) {
            if (t.isJSXElement(child)) {
                children.push(convertJSXtoXML(child));
            }
        }
    }

    return el;
}
