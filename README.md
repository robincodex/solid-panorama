# Solid.js for Valve's Panorama UI

[简体中文](./README-CN.md)

[solid-panorama-example](https://github.com/RobinCodeX/solid-panorama-example)

> Still in the experimental stage

The compiler has been modified and the API of panorama has been optimized.  
For example, adding attribute and parent element to `createElement` greatly reduces the number of API calls and solves the problem that `$. CreatePanelWithProperties` cannot be called.

## Installation

```
yarn add solid.js \
         solid-panorama-runtime \
         babel-plugin-jsx-panorama-expressions \
         babel-preset-solid-panorama
```

## Usage

babel.config.js

```js
module.exports = {
    targets: 'node 8.2',
    presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        [
            'babel-preset-solid-panorama',
            {
                moduleName: 'solid-panorama-runtime',
                generate: 'universal'
            }
        ]
    ],
    plugins: ['@babel/plugin-transform-typescript']
};
```

app.tsx

```tsx
import { onMount } from 'solid-js';
import { render } from 'solid-panorama-runtime';

function HelloWorld() {
    let root: Panel | undefined;
    onMount(() => {
        $.Msg(root);
    });
    return <Panel ref={root}>Hello World!</Panel>;
}

render(() => <HelloWorld />, $('#app'));
```

## About react-panorama

Thanks to ark120202 for creating [react-panorama](https://github.com/ark120202/react-panorama), some of the code for this project was copied from react-panorama and adapted.

## style

The style is compatible. If the style is a string, an error will pop up if the semicolon is not written at the end of the style. Therefore, the semicolon will be automatically added to the parsing during compilation.

When style is Object, some attributes can be assigned numbers, which will be automatically converted to px. The support list can be viewed：[packages/runtime/src/config.ts](https://github.com/RobinCodeX/solid-panorama/blob/master/packages/runtime/src/config.ts#L1)

## class

Both `class` and `className` properties are supported, and since solid.js provides `classList` properties that can be added dynamically by `true | false`, it also provides similar functionality, and all three properties can exist at the same time.

```jsx
<Button
    class={current() === 'foo' ? 'selected' : ''}
    onClick={() => setCurrent('foo')}
>
    foo
</Button>

<Button
  class="my-button"
  classList={{selected: current() === 'foo'}}
  onClick={() => setCurrent('foo')}
>foo</Button>
```

## Event

Not support bubble event.

The event is optimized. The first parameter of the event callback is the element itself.

## Support Text Node

In cases like `<div> Hi </div>` in HTML `Hi` will be rendered as a text node, i.e. textNode.

The text node will automatically create Label and enable html rendering by default, if it contains HTML tags, you need to use string.

Note that if the text is the text that begins with `#`, such as `#addon_game_name`, such will automatically call `$.Localize`, but can not be mixed with other text.

For example, the following is the correct way to write it:

```jsx
// plain text
<Panel>
    Welcome My Game
</Panel>

// includes html tag
<Panel>
    {`<strong>Welcome</strong> My Game`}
</Panel>

// multiple text
<Panel>
    <Label text="Welcome" />
    #addon_game_name
    <Label text="(～￣▽￣)～" />
</Panel>
```

# Custom Attribite

### snippet

Specially properties for panorama, automatically loaded snippet，`<Panel snippet="MyBtton" />`

### vars and dialogVariables

Both are the same, `dialogVariables` is for compatibility [ark120202/react-panorama](https://github.com/ark120202/react-panorama)

-   When value is `string`, call `SetDialogVariable`, if value start width `#` then call `SetDialogVariableLocString`
-   When value is `number`, call `SetDialogVariableInt`
-   When value is `Date`, call `SetDialogVariableTime`

Some adjustments have been made for Label, `vars` and `dialogVariables` will be written first and after set to `Label.text`, if the text starts with `#` it will call `$.Localize(text, Label)`

```jsx
<Label vars={{ name: 'X.X' }} text="#name_of_x" />
```
