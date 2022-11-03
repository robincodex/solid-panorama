import { describe, expect, test } from '@jest/globals';
import { parser } from './utils';

describe('compile', function () {
    test('parse', function () {
        const result = parser(`
            import { render } from 'solid-panorama-runtime';

            function Item(props) {
                return (
                    <Panel class="root">
                        <Label text="Testing" />
                        <Panel class="buttons">
                            <Button />
                            <Button />
                            <Button />
                        </Panel>
                    </Panel>
                );
            }
            
            function HelloWorld() {
                return (
                    <Panel>
                        Hello World!
                        <Item show />
                    </Panel>
                );
            }
            
            render(() => <HelloWorld />, $('#app'));        
        `);
        expect(result).toMatchSnapshot();
    });
});
