import { parseMacros } from './utils';
import { describe, expect, test } from '@jest/globals';
import {
    getAllCacheScss,
    getScss
} from '../packages/babel-plugin-panorama-all-in-jsx/css.macro';
import path from 'path';

describe('css_macro', function () {
    test('pick css', function () {
        const result = parseMacros(
            `
            import css from '../packages/babel-plugin-panorama-all-in-jsx/css.macro';
            
            const ButtonStyle = css\`
                color: #000;
            \`

            // class: GlobalButton
            const ButtonStyle2 = css\`
                color: #000;
            \`
            
            // Global style
            css\`
                .Group {
                    flow-children: right;
                }
            \`

            const obj = {y: css\`y: 0px;\`}

            obj.x = css\`
                x: 0px;
            \`

            css

            css('')

            css(<root></root>)

            function Hi() {
                const ButtonStyle = css\`
                    color: #000;
                \`
            }
        `,
            __filename
        );
        expect(result).toMatchSnapshot();

        expect(getScss(__filename)!).toMatchSnapshot();
        const cache = Object.assign({}, getAllCacheScss());
        const dir = __dirname + path.sep;
        for (const filename in cache) {
            cache[filename.replace(dir, '')] = cache[filename];
            delete cache[filename];
        }
        expect(cache).toMatchSnapshot();
    });
});
