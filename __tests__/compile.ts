import { describe, expect, test } from '@jest/globals';
import { parser } from './utils';

describe('compile', function () {
    test('transform: normal', function () {
        const result = parser(`
            import { render } from 'solid-panorama-runtime';

            function Item(props) {
                const [rootStyle, setRootStyle] = createSignal('root');
                let visible = true
                let root, btnA
                return (
                    <Panel id="root" ref={root} class={rootStyle().join(' ')}>
                        <Label text="Testing" />
                        <Panel class="buttons">
                            <Button ref={(a) => btnA = a} />
                            <Button visible={visible} />
                            <Button />
                        </Panel>
                    </Panel>
                );
            }
            
            function HelloWorld() {
                return (
                    <Panel>
                        <Item />
                        <Item show />
                    </Panel>
                );
            }
            
            render(() => <HelloWorld />, $('#app'));        
        `);
        expect(result).toMatchSnapshot();
    });

    test('transform: fragment', function () {
        expect(() => {
            parser(`
                import { render } from 'solid-panorama-runtime';
                
                function HelloWorld() {
                    return (
                        <>
                            <Button />
                            <Button />
                            <Button />
                        </>
                    );
                }
                
                render(() => <HelloWorld />, $('#app'));        
            `);
        }).toThrow();
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
            
            render(() => <App />, $('#app'));
        `);
        expect(result).toMatchSnapshot();
    });

    test('transform: style', function () {
        const result = parser(`
            import { render } from 'solid-panorama-runtime';
            
            function HelloWorld() {
                return (
                    <Button style={{width:'12px', height: 12}} />
                );
            }
            
            render(() => <HelloWorld />, $('#app'));
        `);
        expect(result).toMatchSnapshot();
    });

    test('transform: textNode', function () {
        const result = parser(`
            import { render } from 'solid-panorama-runtime';
            
            function HelloWorld() {
                return (
                    <Panel>
                        <Panel>
                            Welcome My Game
                        </Panel>
                        <Panel>
                            {\`<strong>Welcome</strong> My Game\`}
                        </Panel>
                        <Panel>
                            <Label text="Welcome" />
                            #addon_game_name
                            <Label text="(～￣▽￣)～" />
                        </Panel>
                    </Panel>
                );
            }
            
            render(() => <HelloWorld />, $('#app'));
        `);
        expect(result).toMatchSnapshot();
    });
});
