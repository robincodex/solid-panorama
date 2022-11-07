import { parseMacros } from './utils';
import { describe, expect, test } from '@jest/globals';
import {
    getAllCacheScss,
    getScss
} from '../packages/babel-plugin-panorama-all-in-jsx/scss.macro';

describe('scss_macro', function () {
    test('pick scss', function () {
        const result = parseMacros(
            `
            import css from '../packages/babel-plugin-panorama-all-in-jsx/scss.macro';
            
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
        for (const filename in cache) {
            cache[filename.replace(__dirname, '')] = cache[filename];
            delete cache[filename];
        }
        expect(cache).toMatchSnapshot();
    });
});
