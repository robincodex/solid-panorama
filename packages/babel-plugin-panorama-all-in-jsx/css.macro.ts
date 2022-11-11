// @ts-check
import { createMacro } from 'babel-plugin-macros';
import * as t from '@babel/types';
import { createHash } from 'crypto';

const scssCache: Record<string, string> = {};
const scssIndex: Record<string, number> = {};

const classCommentMather = /class:\s*([\w\d_-]+)/;

export default createMacro(function ({ references, state, babel }) {
    if (!state.filename) {
        return;
    }
    const filename = state.filename;
    scssCache[filename] = '';
    scssIndex[filename] = 0;
    for (const path of references.default) {
        if (!path.parentPath || !path.parentPath.isTaggedTemplateExpression()) {
            path.parentPath?.remove();
            continue;
        }
        if (path.parentPath.parentPath.isExpressionStatement()) {
            const quasi = path.parentPath.node.quasi;
            if (quasi.quasis[0].value.raw.trim()) {
                scssCache[filename] += quasi.quasis[0].value.raw + '\n';
            }
            path.parentPath.parentPath.remove();
            continue;
        }

        let varName = (++scssIndex[filename]).toString();
        let isForceClass = false;
        const varPath = path.parentPath.parentPath;
        if (varPath && varPath.isVariableDeclarator()) {
            const leadingComments = varPath.parentPath.node.leadingComments;

            if (leadingComments) {
                for (const comment of leadingComments) {
                    const result = classCommentMather.exec(comment.value);
                    if (result && result.length >= 2) {
                        varName = result[1];
                        isForceClass = true;
                        break;
                    }
                }
            }
        }

        const quasi = path.parentPath.node.quasi;
        const id = isForceClass
            ? varName
            : 'styled-' + generateCssID(filename, varName);
        path.parentPath.replaceWith(t.stringLiteral(id));
        scssCache[filename] += `.${id} {${quasi.quasis[0].value.raw}}\n`;
    }
});

function generateCssID(filename: string, varName: string): string {
    filename = filename.replace(process.cwd(), '');
    const h = createHash('sha256')
        .update(filename + varName)
        .digest('hex');
    return h.slice(0, 8);
}

export function getScss(filename: string): string | undefined {
    return scssCache[filename];
}

export function getAllCacheScss(): Record<string, string> {
    return scssCache;
}
