// @ts-check
import { createMacro } from 'babel-plugin-macros';
import * as t from '@babel/types';
import { createHash } from 'crypto';

const scssCache: Record<string, string> = {};

export default createMacro(function ({ references, state, babel }) {
    if (!state.filename) {
        return;
    }
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
        const quasi = path.parentPath.node.quasi;
        path.parentPath.replaceWith(
            t.stringLiteral('scope-' + generateCssID(state.filename, varName))
        );
        scssCache[state.filename] = quasi.quasis[0].value.raw;
    }
});

function generateCssID(filename: string, varName: string): string {
    filename = filename.replace(process.cwd(), '');
    console.log(filename);
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
