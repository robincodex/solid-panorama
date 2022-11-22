import { describe, expect, test } from '@jest/globals';
import { parseSolid } from './utils';

describe('compile', function () {
    test('transform: normal', function () {
        const result = parseSolid(`
            import { render } from 'solid-panorama-runtime';

            function Item(props) {
                const [rootStyle, setRootStyle] = createSignal('root');
                let visible = true
                let root, btnA
                return (
                    <Panel id="root" ref={root} className={rootStyle().join(' ')}>
                        <Label text="Testing" />
                        <Panel className="buttons">
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
        const result = parseSolid(`
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
        expect(result).toMatchSnapshot();
    });

    test('transform: for each', function () {
        const result = parseSolid(`
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
        const result = parseSolid(`
            import { render } from 'solid-panorama-runtime';

            function Item(props) {
                return <Panel class={props.style} />
            }
            
            function HelloWorld() {
                return (
                    <Panel>
                        <Button style={{width:'12px', height: 12}} />
                        <Button style="width:12px; height: 12px" />
                        <Item style="red" />
                    </Panel>
                );
            }
            
            render(() => <HelloWorld />, $('#app'));
        `);
        expect(result).toMatchSnapshot();
    });

    test('transform: textNode', function () {
        const result = parseSolid(`
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

    test('transform: snippet', function () {
        const result = parseSolid(`
            import { render } from 'solid-panorama-runtime';
            
            function HelloWorld() {
                return (
                    <Button snippet="templateA" />
                );
            }
            
            render(() => <HelloWorld />, $('#app'));
        `);
        expect(result).toMatchSnapshot();
    });

    test('transform: spread operator', function () {
        const result = parseSolid(`
            import { render } from 'solid-panorama-runtime';

            function Item(props) {
                return <Panel {...props} />
            }
            
            function HelloWorld() {
                return (
                    <Item />
                );
            }
            
            render(() => <HelloWorld />, $('#app'));
        `);
        expect(result).toMatchSnapshot();
    });

    test('transform: dynamic', function () {
        const result = parseSolid(`
            import { render } from 'solid-panorama-runtime';

            const RedThing = () => <Panel style="color: red">Red Thing</Panel>;
            const GreenThing = () => <Panel style="color: green">Green Thing</Panel>;
            const BlueThing = () => <Panel style="color: blue">Blue Thing</Panel>;

            const options = {
                red: RedThing,
                green: GreenThing,
                blue: BlueThing
            }
            
            function HelloWorld() {
                const [selected, setSelected] = createSignal("red");
                return (
                    <Dynamic component={options[selected()]} />
                );
            }
            
            render(() => <HelloWorld />, $('#app'));
        `);
        expect(result).toMatchSnapshot();
    });

    test('transform: vars', function () {
        const result = parseSolid(`
            import { render } from 'solid-panorama-runtime';

            function HelloWorld() {
                const [ability, setAbility] = createSignal("");
                return (
                    <Panel>
                        <Panel vars={{name: 'robin'}} />
                        <Panel vars={{name: 'robin', ability: ability()}} dialogVariables={{}} />
                    </Panel>
                );
            }
            
            render(() => <HelloWorld />, $('#app'));
        `);
        expect(result).toMatchSnapshot();
    });

    test('custom properties: initialize', function () {
        const result = parseSolid(`
            import { render } from 'solid-panorama-runtime';

            function App() {
                let root

                function onDragEnd() {}

                const onDragDrop = () => {}

                const onDragLeave = function() {}

                return (
                    <Panel 
                        snippet="Button"
                        id="RootPanel"
                        class="root" 
                        hittest={false} 
                        ref={root} 
                        tooltip_text="#addon_game_name"
                        custom_tooltip="tootip_example"
                        custom_tooltip_params={{name: 'test'}}
                        className="root"
                        classList={{root: false}}
                        enabled={false}
                        visible={false}
                        checked={false}
                        hittestchildren={false}
                        acceptsfocus={false}
                        tabindex={0}
                        inputnamespace=""
                        draggable

                        onactivate={() => {}}
                        onDragStart={() => {}}
                        onDragEnd={onDragEnd}
                        onDragDrop={onDragDrop}
                        onDragEnter={function() {}}
                        onDragLeave={onDragLeave}
                        >
                    </Panel>
                );
            }
            
            render(() => <App />, $('#app'));
        `);
        expect(result).toMatchSnapshot();
    });

    test('custom properties: dynamic', function () {
        const result = parseSolid(`
            import { render } from 'solid-panorama-runtime';

            function App() {
                let [enabled] = createSignal(false);
                let [myStyle] = createSignal('');

                return (
                    <Panel
                        class={myStyle()}
                        className={myStyle()}
                        hittest={enabled()}
                        enabled={enabled()}
                        visible={enabled()}
                        checked={enabled()}
                        >
                    </Panel>
                );
            }
            
            render(() => <App />, $('#app'));
        `);
        expect(result).toMatchSnapshot();
    });
});
