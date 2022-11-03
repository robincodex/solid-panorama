import * as babel from '@babel/core';
// @ts-ignore
import jsxTransform from '../packages/babel-plugin-jsx-panorama-expressions/src/index';

export function parser(code: string) {
    const result = babel.transformSync(code, {
        plugins: [
            [
                jsxTransform,
                Object.assign({
                    moduleName: '@solid-panorama/runtime',
                    builtIns: [
                        'For',
                        'Show',
                        'Switch',
                        'Match',
                        'Suspense',
                        'SuspenseList',
                        'Portal',
                        'Index',
                        'Dynamic',
                        'ErrorBoundary'
                    ],
                    contextToCustomElements: true,
                    wrapConditionals: true,
                    generate: 'universal'
                })
            ]
        ]
    });
    return result?.code;
}
