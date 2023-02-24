/// <reference path="../node_modules/@moddota/panorama-types/index.d.ts" />
import { parseMacros } from './utils';
import { describe, expect, test } from '@jest/globals';

describe('events_macro', function () {
    test('useGameEvent', function () {
        const result = parseMacros(
            `
            import { useGameEvent } from '../packages/panorama-all-in-jsx/src/events.macro';

            function Item() {
                let [enabled] = createSignal(false);
                useGameEvent("custom_event", (data) => {
                    console.log('Item', enabled())
                }, enabled())
            }

            function App() {
                useGameEvent("custom_event", (data) => {
                    console.log(data)
                })
            }
        `,
            __filename
        );
        expect(result).toMatchSnapshot();
    });

    test('useNetTable', function () {
        const result = parseMacros(
            `
            import { useNetTable } from '../packages/panorama-all-in-jsx/src/events.macro';

            function Item() {
                const A = useNetTable("table_a", "key_of_one");
                const B = useNetTable("table_b", "key_of_two");
                const BB = useNetTable("table_b", "key_of_bb");
            }

            function App() {
                const one = useNetTable("table_name", "key_of_one");
                const two = useNetTable("table_name", "key_of_two");
                const three = useNetTable("table_name", "key_of_three");

                return <Label text={JSON.stringify(one())} />
            }

            function Root() {
                const one = useNetTable("table_name", "key_of_one");
                const [two, setTwo] = createSignal("");
                const [one2, _setOne2] = createSignal("");

                return <Label text={JSON.stringify(one())} />

                function test() {
                    return 0;
                }
            }
        `,
            __filename
        );
        expect(result).toMatchSnapshot();
    });
});
