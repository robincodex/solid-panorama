import { parseMacros } from './utils';
import { describe, expect, test } from '@jest/globals';
import xml from '@babel-plugin-panorama-all-in-jsx/xml.macro';

describe('xml_macro', function () {
    test('jsx', function () {
        const result = parseMacros(
            `
            import xml from '../dist/babel-plugin-panorama-all-in-jsx/xml.macro';
            
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
    });
});
