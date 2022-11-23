import rollupTypescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import p from './package.json';
import { terser } from 'rollup-plugin-terser';

const external = Object.keys(p.dependencies);
const compilerOptions = require('./tsconfig.json').compilerOptions;

const runtimeConfig = {
    input: 'packages/runtime/src/index.ts',
    output: {
        dir: 'dist/runtime',
        sourcemap: false,
        format: 'es'
    },
    external,
    plugins: [
        rollupTypescript(compilerOptions),
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
    external,
    output: {
        dir: 'dist/babel-plugin-jsx-panorama-expressions',
        format: 'cjs',
        exports: 'auto',
        interop: 'esModule'
    },
    plugins: [
        commonjs(),
        nodeResolve({
            moduleDirectories: ['node_modules', 'packages']
        }),
        copy({
            targets: [
                {
                    src: 'packages/babel-plugin-jsx-panorama-expressions/package.json',
                    dest: 'dist/babel-plugin-jsx-panorama-expressions'
                },
                {
                    src: 'packages/babel-plugin-jsx-panorama-expressions/src/index.d.ts',
                    dest: 'dist/babel-plugin-jsx-panorama-expressions'
                }
            ]
        })
    ]
};

const macroConfig = {
    input: [
        'packages/panorama-all-in-jsx/xml.macro.ts',
        'packages/panorama-all-in-jsx/css.macro.ts'
    ],
    output: {
        dir: 'dist/panorama-all-in-jsx',
        sourcemap: false,
        format: 'cjs',
        exports: 'named'
    },
    external,
    plugins: [
        json(),
        rollupTypescript(compilerOptions),
        commonjs({ extensions: ['.js', '.ts'] }),
        nodeResolve({
            moduleDirectories: ['node_modules', 'packages']
        }),
        copy({
            targets: [
                {
                    src: 'packages/panorama-all-in-jsx/types/*.d.ts',
                    dest: 'dist/panorama-all-in-jsx'
                },
                {
                    src: 'packages/panorama-all-in-jsx/package.json',
                    dest: 'dist/panorama-all-in-jsx'
                }
            ]
        })
    ]
};

const polyfillConfig = {
    output: {
        dir: 'dist/solid-panorama-polyfill',
        sourcemap: false,
        format: 'iife',
        exports: 'named'
    },
    plugins: [
        json(),
        rollupTypescript({
            include: './packages/panorama-polyfill/**/*.ts',
            exclude: ['**/types/console.d.ts', '**/types/timers.d.ts'],
            compilerOptions:
                require('./packages/panorama-polyfill/tsconfig.json')
                    .compilerOptions
        }),
        commonjs({ extensions: ['.js', '.ts'] }),
        nodeResolve({
            moduleDirectories: ['node_modules', 'packages']
        }),
        copy({
            targets: [
                {
                    src: 'packages/panorama-polyfill/types/*.d.ts',
                    dest: 'dist/solid-panorama-polyfill'
                },
                {
                    src: 'packages/panorama-polyfill/package.json',
                    dest: 'dist/solid-panorama-polyfill'
                }
            ]
        }),
        terser()
    ]
};

if (process.env['OnlyBuildRuntime']) {
    module.exports = runtimeConfig;
} else if (process.env['OnlyBuildJSX']) {
    module.exports = jsxConfig;
} else if (process.env['OnlyBuildMacros']) {
    module.exports = macroConfig;
} else if (process.env['OnlyBuildPolyfill']) {
    module.exports = [
        Object.assign({}, polyfillConfig, {
            input: './packages/panorama-polyfill/src/timers.ts'
        }),
        Object.assign({}, polyfillConfig, {
            input: './packages/panorama-polyfill/src/console.ts'
        })
    ];
} else {
    module.exports = [runtimeConfig, jsxConfig, macroConfig];
}
