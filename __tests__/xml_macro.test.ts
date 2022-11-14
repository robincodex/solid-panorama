import { parseMacros } from './utils';
import { describe, expect, test } from '@jest/globals';
import {
    formatXML,
    getAllCacheXML,
    getXML
} from '../packages/panorama-all-in-jsx/xml.macro';
import path from 'path';

describe('xml_macro', function () {
    test('convert jsx to xml', function () {
        const result = parseMacros(
            `
            import xml from '../packages/panorama-all-in-jsx/xml.macro';
            
            xml(
                <root>
                    <styles>
                        <include src="s2r://panorama/styles/dotastyles.vcss_c"/>
                        <include src="file://{resources}/styles/custom_game/hud_main.css"/>
                    </styles>
                    <scripts>
                        <include src="file://{resources}/scripts/custom_game/hud_main.js"/>
                    </scripts>
                    <Panel>
                        <Panel id="app" />
                    </Panel>
                </root>
            )

            xml

            xml('<root></root>')

            function Hi() {

            }
        `,
            __filename
        );
        expect(result).toMatchSnapshot();

        expect(formatXML(getXML(__filename)!)).toMatchSnapshot();
        const cache = Object.assign({}, getAllCacheXML());
        const dir = __dirname + path.sep;
        for (const filename in cache) {
            cache[filename.replace(dir, '')] = cache[filename];
            delete cache[filename];
        }
        expect(cache).toMatchSnapshot();
    });
});
