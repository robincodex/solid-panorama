import rollupTypescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

const runtimeConfig = {
    input: 'packages/runtime/src/index.ts',
    output: {
        dir: 'dist/runtime',
        sourcemap: false,
        format: 'es'
    },
    external: [
        'solid-js',
        'solid-js/universal'
    ],
    plugins: [
        rollupTypescript(require('./tsconfig.json').compilerOptions),
        commonjs({ extensions: ['.js', '.ts'] }),
        nodeResolve({
            moduleDirectories: ['node_modules', 'packages']
        }),
        copy({
            targets: [
                {
                    src: 'packages/runtime/package.json',
                    dest: 'dist/runtime'
                },
                {
                    src: 'packages/runtime/types/*',
                    dest: 'dist/runtime'
                }
            ]
        })
    ]
};

const jsxConfig = {
    input: 'packages/babel-plugin-jsx-panorama-expressions/src/index.js',
    external: [
        '@babel/plugin-syntax-jsx',
        '@babel/helper-module-imports',
        '@babel/types',
        'html-entities'
    ],
    output: {
        dir: 'dist/babel-plugin-jsx-panorama-expressions',
        format: 'cjs',
        exports: 'auto'
    },
    plugins: [
        nodeResolve({
            moduleDirectories: ['node_modules', 'packages']
        }),
        copy({
            targets: [
                {
                    src: 'packages/babel-plugin-jsx-panorama-expressions/package.json',
                    dest: 'dist/babel-plugin-jsx-panorama-expressions'
                }
            ]
        })
    ]
};

if (process.env['OnlyBuildRuntime']) {
    module.exports = runtimeConfig;
} else if (process.env['OnlyBuildJSX']) {
    module.exports = jsxConfig;
} else {
    module.exports = [runtimeConfig, jsxConfig];
}
