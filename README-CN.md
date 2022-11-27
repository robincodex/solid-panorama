# Solid.js for Valve's Panorama UI

尚在实验阶段

[solid-panorama-example](https://github.com/RobinCodeX/solid-panorama-example)

魔改了编译，针对 PUI 的 API 进行了优化，比如`createElement`加入属性和父元素两个参数，就极大减少了过多的 API 调用，也解决了无法调用`$.CreatePanelWithProperties`的问题。

## 安装

```
yarn add solid.js \
         solid-panorama-runtime \
         babel-plugin-jsx-panorama-expressions \
         babel-preset-solid-panorama
```

## 使用

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

## 可选功能

-   如果你想使用`console.log`或者`setTimeout`等 Web 函数，可以参考[solid-panorama-polyfill](./packages/panorama-polyfill/)，或者使用[panorama-polyfill](https://github.com/ark120202/panorama-polyfill)
-   如果你想把 xml 或 css 放在 jsx/tsx 里面，可以参考[solid-panorama-all-in-jsx](./packages/panorama-all-in-jsx/)。
-   如果你想用`useGameEvent`，可以参考[solid-panorama-all-in-jsx](./packages/panorama-all-in-jsx/)。

## style

对 style 进行了兼容，如果 style 是字符串，在 PUI 里 style 末尾不写分号会弹出错误，所以在编译时会解析自动加上分号。

当 style 是 Object 时，某些属性可以赋值数字，会自动转换成 px，支持列表可查看：[packages/runtime/src/config.ts](https://github.com/RobinCodeX/solid-panorama/blob/master/packages/runtime/src/config.ts#L1)

## class

`class`和`className`两个属性都是支持的，由于 solid.js 提供`classList`属性可按`true | false`动态添加，所以也提供类似的功能，三个属性可同时存在。

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

## 事件

PUI 的元素事件与 WEB 的完全不同，PUI 是较为简单的，而且绝大多数情况下也不需要向上冒泡，所以不会支持事件冒泡的功能。

对事件进行了优化，事件的回调函数第一个参数是元素本身。

## 支持文本节点

在 HTML 中`<div> Hi </div>`这类情况下`Hi`会渲染成文本节点，也就是 textNode，

文本节点会自动创建 Label，并且默认启用 html 渲染，如果包含 HTML 标签，需要用字符串。

需要注意的是如果文本是以`#`开头的文本，比如`#addon_game_name`，此类会自动调用`$.Localize`，但是不能参杂其它文本。

例如，以下是正确的写法：

```jsx
// 纯文本
<Panel>
    Welcome My Game
</Panel>

// 带HTML标签
<Panel>
    {`<strong>Welcome</strong> My Game`}
</Panel>

// 拼接本地化字段
<Panel>
    <Label text="Welcome" />
    #addon_game_name
    <Label text="(～￣▽￣)～" />
</Panel>
```

## 自定义属性

### snippet

类型：`string`

自动载入 snippet

```jsx
<Panel snippet="MyBtton" />
```

### vars 和 dialogVariables

类型：`Record<string, string | number | Date>`

两者是一样的，`dialogVariables` 是为了兼容[ark120202/react-panorama](https://github.com/ark120202/react-panorama)

-   当值为`string`时，调用`SetDialogVariable`，如果以`#`开头则调用`SetDialogVariableLocString`
-   当值为`number`时，调用`SetDialogVariableInt`
-   当值为`Date`时，调用`SetDialogVariableTime`

针对 Label 做了一些调整，vars 和 dialogVariables 会先写入，然后再写入`Label.text`, 如果 text 以`#`开头会调用`$.Localize(text, Label)`。

```jsx
<Label vars={{ name: '#addon_game_name' }} text="Welcome {d:name}" />
```

### attrs

类型：`Record<string, string | number>`

-   当值为`string`时，调用`SetAttributeString`
-   当值为`number`时，调用`SetAttributeInt`

```jsx
<Panel attrs={{ name: 'my name' }} />
```

### tooltip_text

类型：`string`

自动设置`onmouseover="DOTAShowTextTooltip(<token>)"`和`onmouseout="DOTAHideTextTooltip()"`

> 注意：不能与 onmouseover 和 onmouseout 事件同时存在

```jsx
<Panel tooltip_text="#addon_game_name" />
```

### custom_tooltip

类型：`[string, string]`

对应`[<tooltip name>, <xml file path>]`

自动设置`onmouseover="UIShowCustomLayoutParametersTooltip()"`和`onmouseout="UIHideCustomLayoutTooltip()"`

> 注意：不能与 onmouseover 和 onmouseout 事件同时存在

```jsx
<Panel custom_tooltip={['Item', 'file://{resources}/layout/custom_game/tooltip_example.xml']} custom_tooltip_params={{ name: 'item_xxx' }} />
// OR
<Panel custom_tooltip={['Item', 'tooltip_example']} custom_tooltip_params={{ name: 'item_xxx' }} />
```

### custom_tooltip_params

类型：`Record<string, string | number>`

### 拖拽事件

```ts
onDragStart?: (source: Panel, dragCallbacks: IDragCallbacks) => void;
onDragEnd?: (source: Panel, draggedPanel: Panel) => void;
onDragEnter?: (source: Panel, draggedPanel: Panel) => void;
onDragDrop?: (source: Panel, draggedPanel: Panel) => void;
onDragLeave?: (source: Panel, draggedPanel: Panel) => void;
```

如果设置了`onDragStart`，会自动调用`SetDraggable(true)`，所以可以不用`draggable`属性。

```tsx
function onItemDragStart(source: Panel, dragCallbacks: IDragCallbacks) {
    // ...
}

<Panel onDragStart={onItemDragStart} />;
```
