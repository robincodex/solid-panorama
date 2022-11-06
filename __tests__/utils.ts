import * as babel from '@babel/core';
import jsxTransform from '../packages/babel-plugin-jsx-panorama-expressions/src/index';
import macros from 'babel-plugin-macros';

export function parseSolid(code: string) {
    const result = babel.transformSync(code, {
        plugins: [
            [
                jsxTransform,
                Object.assign({
                    moduleName: 'solid-panorama-runtime',
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

export function parseMacros(code: string, filename?: string) {
    const result = babel.transformSync(code, {
        cwd: __dirname,
        filename,
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: 'node 18.0'
                }
            ]
        ],
        plugins: [['@babel/plugin-syntax-jsx'], [macros]]
    });
    return result?.code;
}
