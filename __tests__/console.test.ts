/// <reference path="../node_modules/@moddota/panorama-types/index.d.ts" />

import { describe, expect, test } from '@jest/globals';
import {
    format,
    formatx
} from '../packages/panorama-polyfill/src/utils/format';

describe('console', function () {
    test('format', function () {
        const style = {
            paneltype: '',
            rememberchildfocus: '',
            SetPanelEvent: '',
            RunScriptInPanelContext: ''
        };
        const s = Symbol('s');
        const int = BigInt(99999);

        class testClass {}
        function testFunc() {}

        expect(
            format('test: %s %d %j', 'str', 123, false, 'test', { a: 123 })
        ).toMatchSnapshot();

        expect(
            formatx('test: %s %d %j', 'str', 123, false, 'test', { a: 123 })
        ).toMatchSnapshot();

        expect(
            format({
                x: 1,
                y: '123',
                c: 'str',
                d: false,
                e: undefined,
                f: null,
                g: function () {},
                h: () => {},
                i: test,
                style,
                map: new Map([
                    ['a', 2],
                    ['b', 1]
                ]),
                map2: new Map([
                    [[], 2],
                    [[], 1]
                ]),
                map3: new Map([[{}, 2]]),
                map4: new Map([[Symbol('a'), 2]]),
                set: new Set([1, 2, 3]),
                testClass,
                testFunc
            })
        ).toMatchSnapshot();

        expect(
            format({
                obj: { x: 1, y: 2, c: [123, { b: null }], style },
                ary: [1, 2, 3, 'A', false, null, [4, 56, { g: 1, c: [] }]]
            })
        ).toMatchSnapshot();

        expect(
            formatx(
                {
                    x: 1,
                    y: '123',
                    c: 'str',
                    d: false,
                    e: undefined,
                    f: null,
                    g: function () {},
                    h: () => {},
                    i: test,
                    style,
                    s,
                    int,
                    map: new Map([
                        ['a', 2],
                        ['b', 1]
                    ]),
                    map2: new Map([
                        [[], 2],
                        [[], 1]
                    ]),
                    map3: new Map([[{}, 2]]),
                    map4: new Map([[Symbol('a'), 2]]),
                    set: new Set([1, 2, 3]),
                    test: testClass,
                    func: testFunc
                },
                true
            )
        ).toMatchSnapshot();

        expect(
            formatx(
                {
                    obj: {
                        x: 1,
                        y: 2,
                        style: {},
                        c: [123, { b: null, a: [null] }, [null]]
                    },
                    ary: [
                        1,
                        2,
                        3,
                        'A',
                        false,
                        null,
                        [4, 56, { g: 1, c: [{ c: 45 }] }]
                    ]
                },
                true
            )
        ).toMatchSnapshot();
    });
});
