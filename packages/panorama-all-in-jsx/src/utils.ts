import { NodePath } from '@babel/core';
import { addNamed } from '@babel/helper-module-imports';
import * as t from '@babel/types';

export function registerImportMethod(
    path: NodePath,
    name: string,
    moduleName: string
) {
    let imports = path.scope.getProgramParent().getData('imports');
    if (!imports) {
        imports = new Map();
        path.scope.getProgramParent().setData('imports', imports);
    }
    if (!imports.has(`${moduleName}:${name}`)) {
        let id = addNamed(path, name, moduleName, {
            nameHint: `_$${name}`
        });
        imports.set(`${moduleName}:${name}`, id);
        return id;
    } else {
        let iden = imports.get(`${moduleName}:${name}`);
        return t.cloneNode(iden);
    }
}
