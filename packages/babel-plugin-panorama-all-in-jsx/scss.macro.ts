// @ts-check
import { createMacro } from 'babel-plugin-macros';
import * as t from '@babel/types';
import { createHash } from 'crypto';

const scssCache: Record<string, string> = {};

function normalizedPath(p: string) {
    return p.replace(/\\/g, '/');
}

export default createMacro(function ({ references, state, babel }) {
    if (!state.filename) {
        return;
    }
    const filename = normalizedPath(state.filename);
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
        if (path.scope.path.isFunctionDeclaration()) {
            varName = (path.scope.path.node.id?.name || '') + '-' + varName;
        }
        const quasi = path.parentPath.node.quasi;
        path.parentPath.replaceWith(
            t.stringLiteral('styled-' + generateCssID(filename, varName))
        );
        scssCache[filename] = quasi.quasis[0].value.raw;
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
