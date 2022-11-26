declare module '@babel/helper-module-imports' {
    import { NodePath } from '@babel/core';
    export function addNamed(
        path: NodePath,
        named: string,
        module: string,
        options: object
    ): any;
}
