import { createMacro } from 'babel-plugin-macros';
import * as t from '@babel/types';
import xmljs from 'xml-js';

interface XMLFile {
    root?: xmljs.Element;
    snippets: xmljs.Element[];

    _rootSnippets?: xmljs.Element[];
}

const xmlCache: Record<string, XMLFile> = {};

export default createMacro(function ({ references, state, babel }) {
    if (!state.filename) {
        return;
    }
    const filename = state.filename;
    for (const path of references.default) {
        if (!path.parentPath || !path.parentPath.isCallExpression()) {
            path.parentPath?.remove();
            continue;
        }
        for (const el of path.parentPath.node.arguments) {
            if (!t.isJSXElement(el)) {
                throw new Error('the xml arguments must be jsx element');
            }
            const result = convertJSXtoXML(el);
            if (!xmlCache[filename]) {
                xmlCache[filename] = {
                    root: {},
                    snippets: []
                };
            }
            if (isRoot(result)) {
                xmlCache[filename].root = result;
            } else if (isSnippet(result)) {
                if (existsSnippet(xmlCache[filename].snippets, result)) {
                    console.warn(
                        `${filename}: snippet ${result.attributes?.name} is exists`
                    );
                } else {
                    xmlCache[filename].snippets.push(result);
                }
            } else {
                throw new Error(
                    'Root element only support <root> or <snippet>'
                );
            }
        }
        path.parentPath?.remove();
    }
});

export function getXML(filename: string): XMLFile | undefined {
    return xmlCache[filename];
}

export function getAllCacheXML(): Record<string, XMLFile> {
    return xmlCache;
}

export function formatXML(files: XMLFile[]): string {
    let rootFile = files.find(v => v.root && isRoot(v.root));
    if (!rootFile?.root) {
        throw new Error('Not found <root>');
    }

    let snippets = rootFile.root.elements!.find(v => v.name === 'snippets');
    if (!snippets) {
        snippets = {
            type: 'element',
            name: 'snippets',
            elements: []
        };
        let index = rootFile.root.elements!.findIndex(v => v.name === 'Panel');
        rootFile.root.elements!.splice(index, 0, snippets);
    }
    if (!rootFile._rootSnippets) {
        rootFile._rootSnippets = snippets.elements || [];
    }
    snippets.elements = [
        ...rootFile._rootSnippets,
        ...rootFile.snippets,
        ...files
            .filter(v => v !== rootFile)
            .map(v => v.snippets)
            .flat()
    ];

    return xmljs.js2xml(
        { elements: [rootFile.root] },
        { compact: false, spaces: '  ' }
    );
}

function isRoot(el: xmljs.Element): boolean {
    return el.name === 'root';
}

function isSnippet(el: xmljs.Element): boolean {
    return el.name === 'snippet';
}

function existsSnippet(snippets: xmljs.Element[], el: xmljs.Element): boolean {
    if (!isSnippet(el)) {
        return false;
    }
    const name = el.attributes?.name;
    return (
        snippets.some(
            v => v.name === 'snippet' && v.attributes?.name === name
        ) === true
    );
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
        if (t.isJSXAttribute(attrNode) && t.isJSXIdentifier(attrNode.name)) {
            if (attrNode.value) {
                if (t.isStringLiteral(attrNode.value)) {
                    attrs[attrNode.name.name] = attrNode.value.value;
                } else if (t.isJSXExpressionContainer(attrNode.value)) {
                    if (
                        t.isBooleanLiteral(attrNode.value.expression) ||
                        t.isNumericLiteral(attrNode.value.expression) ||
                        t.isStringLiteral(attrNode.value.expression)
                    ) {
                        attrs[attrNode.name.name] = String(
                            attrNode.value.expression.value
                        );
                    }
                }
            } else {
                attrs[attrNode.name.name] = 'true';
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
