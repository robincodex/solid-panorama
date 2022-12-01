import { parseMacros } from './utils';
import { describe, expect, test } from '@jest/globals';
import {
    formatXML,
    getAllCacheXML,
    getXML
} from '../packages/panorama-all-in-jsx/src/xml.macro';
import path from 'path';

describe('xml_macro', function () {
    function filename(suffix: string) {
        return __filename + suffix;
    }

    test('convert jsx to xml', function () {
        const result = parseMacros(
            `
            import xml from '../packages/panorama-all-in-jsx/src/xml.macro';
            
            xml(
                <root>
                    <styles>
                        <include src="s2r://panorama/styles/dotastyles.vcss_c"/>
                        <include src="file://{resources}/styles/custom_game/hud_main.css"/>
                    </styles>
                    <scripts>
                        <include src="file://{resources}/scripts/custom_game/hud_main.js"/>
                    </scripts>
                    <Panel hittest={false} tabindex={0}>
                        <Panel id="app" class={"test"} />
                    </Panel>
                </root>
            )

            xml
            xml()

            function Hi() {}
        `,
            filename('1')
        );
        expect(result).toMatchSnapshot();

        expect(formatXML([getXML(filename('1'))!])).toMatchSnapshot();
        const cache = Object.assign({}, getAllCacheXML());
        const dir = __dirname + path.sep;
        for (const filename in cache) {
            cache[filename.replace(dir, '')] = cache[filename];
            delete cache[filename];
        }
        expect(cache).toMatchSnapshot();
    });

    test('merge snippet', function () {
        const result = parseMacros(
            `
            import xml from '../packages/panorama-all-in-jsx/src/xml.macro';
            
            xml(
                <snippet name="Ability">
                    <Panel class="Ability">
                        <Image />
                    </Panel>
                </snippet>,
                <snippet name="Item">
                    <Panel class="Item">
                        <Image />
                    </Panel>
                </snippet>
            )

            xml(
                <root>
                    <Panel>
                    </Panel>
                </root>
            )
        `,
            filename('2')
        );
        expect(result).toMatchSnapshot();

        expect(formatXML([getXML(filename('2'))!])).toMatchSnapshot();
    });

    test('merge snippet multi files', function () {
        parseMacros(
            `
            import xml from '../packages/panorama-all-in-jsx/src/xml.macro';
            xml(
                <snippet name="FileA">
                    <Panel class="Ability">
                        <Image />
                    </Panel>
                </snippet>
            )
        `,
            filename('21')
        );
        parseMacros(
            `
            import xml from '../packages/panorama-all-in-jsx/src/xml.macro';
            xml(
                <snippet name="FileB">
                    <Panel class="Item">
                        <Image />
                    </Panel>
                </snippet>
            )
        `,
            filename('22')
        );
        parseMacros(
            `
            import xml from '../packages/panorama-all-in-jsx/src/xml.macro';
            xml(
                <root>
                    <snippets>
                        <snippet name="Root">
                            <Panel class="Item">
                                <Image />
                            </Panel>
                        </snippet>
                    </snippets>
                    <Panel>
                    </Panel>
                </root>
            )
        `,
            filename('23')
        );

        expect(
            formatXML([
                getXML(filename('21'))!,
                getXML(filename('22'))!,
                getXML(filename('23'))!
            ])
        ).toMatchSnapshot();
        expect(
            formatXML([
                getXML(filename('21'))!,
                getXML(filename('22'))!,
                getXML(filename('23'))!
            ])
        ).toMatchSnapshot();
    });

    test('error', function () {
        expect(() => {
            parseMacros(
                `
                import xml from '../packages/panorama-all-in-jsx/src/xml.macro';
                xml('')
            `,
                filename('3')
            );
        }).toThrow();

        expect(() => {
            parseMacros(
                `
                import xml from '../packages/panorama-all-in-jsx/src/xml.macro';
                xml(<Panel />)
            `,
                filename('4')
            );
        }).toThrow();

        expect(() => {
            parseMacros(
                `
                import xml from '../packages/panorama-all-in-jsx/src/xml.macro';
                xml(<snippet name="Ability"></snippet>)
            `,
                filename('5')
            );
            formatXML([getXML(filename('5'))!]);
        }).toThrow();
    });
});
