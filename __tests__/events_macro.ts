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
                    console.log(enabled())
                })
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
});
