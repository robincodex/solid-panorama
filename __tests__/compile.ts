import { describe, expect, test } from '@jest/globals';
import { parser } from './utils';

describe('compile', function () {
    test('transform: normal', function () {
        const result = parser(`
            import { render } from 'solid-panorama-runtime';

            function Item(props) {
                const [rootStyle, setRootStyle] = createSignal('root');
                let root, btnA
                return (
                    <Panel id="root" ref={root} class={rootStyle().join(' ')}>
                        <Label text="Testing" />
                        <Panel class="buttons">
                            <Button ref={(b) => btnA = b} />
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

    test('transform: for each', function () {
        const result = parser(`
            import { render } from "solid-js/web";
            import { createSignal } from "solid-js";
            
            const App = () => {
                const [list, setList] = createSignal(['A']);
                
                function click() {
                    setList([...list(), "B"])
                }
                
                return <Panel>
                    <For each={list()} >
                        {(item, index) => {
                        return <Label text={item} />
                        }}
                    </For>
                    <Button onClick={click}>Click</Button>
                </Panel>;
            };
            
            render(() => <App />, document.getElementById("app"));   
        `);
        expect(result).toMatchSnapshot();
    });
});
