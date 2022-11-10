// @ts-check
import { createMacro } from 'babel-plugin-macros';
import * as t from '@babel/types';
import { createHash } from 'crypto';

const scssCache: Record<string, string> = {};

const classCommentMather = /class:\s*([\w\d_-]+)/;

export default createMacro(function ({ references, state, babel }) {
    if (!state.filename) {
        return;
    }
    const filename = state.filename;
    scssCache[filename] = '';
    for (const path of references.default) {
        if (!path.parentPath || !path.parentPath.isTaggedTemplateExpression()) {
            path.parentPath?.remove();
            continue;
        }
        const varPath = path.parentPath.parentPath;
        if (!varPath || !varPath.isVariableDeclarator()) {
            path.parentPath.replaceWith(t.stringLiteral(''));
            continue;
        }
        let varName = '';
        if (t.isIdentifier(varPath.node.id)) {
            varName = varPath.node.id.name;
        }

        const leadingComments = varPath.parentPath.node.leadingComments;
        let isForceClass = false;
        if (leadingComments) {
            for (const comment of leadingComments) {
                const result = classCommentMather.exec(comment.value);
                if (result && result.length >= 2) {
                    console.log(result[1]);
                    varName = result[1];
                    isForceClass = true;
                    break;
                }
            }
        }

        if (path.scope.path.isFunctionDeclaration()) {
            varName = (path.scope.path.node.id?.name || '') + '-' + varName;
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
