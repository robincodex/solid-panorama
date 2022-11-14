import { parseMacros } from './utils';
import { describe, expect, test } from '@jest/globals';
import {
    getAllCacheCSS,
    getCSS
} from '../packages/panorama-all-in-jsx/css.macro';
import path from 'path';

describe('css_macro', function () {
    test('pick css', function () {
        const result = parseMacros(
            `
            import css from '../packages/panorama-all-in-jsx/css.macro';
            import { CommonButtonStyle } from './css_a';
            
            const ButtonStyle = css\`
                color: #000;
            \`

            // class: GlobalButton
            let ButtonStyle2 = css\`
                color: #000;
            \`

            var ButtonStyle3 = css\`
                color: #000;
            \`

            // Global style
            css\`
                .Group {
                    flow-children: right;
                    \${ButtonStyle} {
                        flow-children: right;
                    }
                    \${ButtonStyle2} {
                        flow-children: right;
                    }
                    \${ButtonStyle3} {
                        flow-children: right;
                    }
                    \${CommonButtonStyle} {
                        flow-children: right;
                    }
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

        expect(getCSS(__filename)!).toMatchSnapshot();
        const cache = Object.assign({}, getAllCacheCSS());
        const dir = __dirname + path.sep;
        for (const filename in cache) {
            cache[filename.replace(dir, '')] = cache[filename];
            delete cache[filename];
        }
        expect(cache).toMatchSnapshot();
    });
});
