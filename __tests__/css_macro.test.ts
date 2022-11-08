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

            const ButtonStyle2 = css\`
                color: #000;
            \`

            const obj = {y: css\`color: #000;\`}

            obj.x = css\`
                color: #000;
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
