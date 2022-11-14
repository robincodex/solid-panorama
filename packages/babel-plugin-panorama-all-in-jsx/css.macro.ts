// @ts-check
import { createMacro } from 'babel-plugin-macros';
import * as t from '@babel/types';
import { createHash } from 'crypto';
import { NodePath, PluginPass } from '@babel/core';
import * as Babel from '@babel/core';
import { join } from 'path';
import { existsSync } from 'fs';

const cssCache: Record<string, string> = {};
const cssIndex: Record<string, number> = {};
const cssFileClassName: Record<string, Record<string, string>> = {};

const classCommentMather = /class:\s*([\w\d_-]+)/;

export default createMacro(function ({ references, state, babel }) {
    if (!state.filename) {
        return;
    }
    const filename = state.filename;
    cssCache[filename] = '';
    cssIndex[filename] = 0;
    for (const path of references.default) {
        if (!path.parentPath || !path.parentPath.isTaggedTemplateExpression()) {
            path.parentPath?.remove();
            continue;
        }
        if (path.parentPath.parentPath.isExpressionStatement()) {
            cssCache[filename] += convertToString(
                path.parentPath,
                state,
                babel
            );
            path.parentPath.parentPath.remove();
            continue;
        }

        let index = (++cssIndex[filename]).toString();
        let isForceClass = false;
        let varName = '';
        const varPath = path.parentPath.parentPath;
        if (varPath && varPath.isVariableDeclarator()) {
            const leadingComments = varPath.parentPath.node.leadingComments;
            if (leadingComments) {
                for (const comment of leadingComments) {
                    const result = classCommentMather.exec(comment.value);
                    if (result && result.length >= 2) {
                        index = result[1];
                        isForceClass = true;
                        break;
                    }
                }
            }
            if (t.isIdentifier(varPath.node.id)) {
                varName = varPath.node.id.name;
            }
        }

        const id = isForceClass
            ? index
            : 'styled-' + generateCssID(filename, index);

        if (varName) {
            if (!cssFileClassName[filename]) {
                cssFileClassName[filename] = {};
            }
            const className = cssFileClassName[filename];
            className[varName] = id;
        }

        const code = convertToString(path.parentPath, state, babel);
        path.parentPath.replaceWith(t.stringLiteral(id));
        cssCache[filename] += `.${id} {${code}}\n`;
    }
});

function generateCssID(filename: string, varName: string): string {
    filename = filename.replace(process.cwd(), '').replace(/\\/g, '/');
    const h = createHash('sha256')
        .update(filename + varName)
        .digest('hex');
    return h.slice(0, 8);
}

export function getCSS(filename: string): string | undefined {
    return cssCache[filename];
}

export function getAllCacheCSS(): Record<string, string> {
    return cssCache;
}

function convertToString(
    path: NodePath<t.TaggedTemplateExpression>,
    state: PluginPass,
    babel: typeof Babel
): string {
    let code = '';
    const quasi = path.node.quasi;
    for (const [i, q] of quasi.quasis.entries()) {
        code += q.value.raw;
        const exp = quasi.expressions[i];
        if (exp) {
            if (t.isIdentifier(exp)) {
                const bind = path.scope.getBinding(exp.name);
                if (!bind) {
                    throw new Error('Not found variable: ' + exp.name);
                }
                const kind = bind.kind;
                if (kind === 'const' || kind === 'let' || kind === 'var') {
                    if (bind.path.isVariableDeclarator()) {
                        if (t.isStringLiteral(bind.path.node.init)) {
                            code += '.' + bind.path.node.init.value;
                        }
                    }
                } else if (kind === 'module') {
                    const importPath = bind.path.parentPath;
                    if (importPath && importPath.isImportDeclaration()) {
                        const id = searchStaticValueFromModules(
                            exp.name,
                            importPath.node.source.value,
                            state,
                            babel
                        );
                        if (id) {
                            code += '.' + id;
                        }
                    }
                }
            } else {
                console.log(exp);
            }
        }
    }
    return code;
}

function searchStaticValueFromModules(
    name: string,
    moduleName: string,
    state: PluginPass,
    babel: typeof Babel
) {
    let filename = join(state.cwd, moduleName);
    if (existsSync(filename + '.tsx')) {
        filename += '.tsx';
    } else if (existsSync(filename + '.jsx')) {
        filename += '.jsx';
    } else if (existsSync(filename + '.ts')) {
        filename += '.ts';
    } else if (existsSync(filename + '.js')) {
        filename += '.js';
    }
    if (!cssFileClassName[filename]) {
        babel.transformFileSync(filename, state.file.opts);
    }
    const cache = cssFileClassName[filename];
    if (cache && cache[name]) {
        return cache[name];
    }
}
