import rollupTypescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

module.exports = [
    {
        input: 'packages/runtime/src/index.ts',
        output: {
            dir: 'dist/runtime',
            sourcemap: false,
            format: 'es'
        },
        external: [],
        plugins: [
            rollupTypescript(require('./tsconfig.json').compilerOptions),
            commonjs({ extensions: ['.js', '.ts'] }),
            nodeResolve(),
            copy({
                targets: [
                    {
                        src: 'packages/runtime/package.json',
                        dest: 'dist/runtime'
                    }
                ]
            })
        ]
    }
];
