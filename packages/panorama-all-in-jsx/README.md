# Panorama all in jsx

这个插件的目的是将 xml 和 css 都放入 jsx 或者 tsx 中，当然这不一定符合你的习惯，选择使用即可；

这个插件是基于`babel-plugin-macros`开发的，所以只要你用了 babel 编译代码即可，本项目目前没有计划提供打包工具的插件，但是提供了 API 接口。

# XML

xml 是基于 jsx 实现的，将 jsx 转换成 xml，属性的值仅支持字符串、数字、布尔值这三种常量，不支持调用函数或者引用其它声明的变量等。

如代码所示，`hittest={false}`会转换为`hittest="false"`，`tabindex={0}`会转换为`tabindex="0"`，

你需要把这部分当作一个 xml 文件去写。

```jsx
import xml from 'solid-panorama-all-in-jsx/xml.macro';

xml(
    <root>
        <styles>
            <include src="s2r://panorama/styles/dotastyles.vcss_c" />
            <include src="file://{resources}/styles/custom_game/hud_main.css" />
        </styles>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/hud_main.js" />
        </scripts>
        <Panel hittest={false} tabindex={0}>
            <Panel id="app" />
        </Panel>
    </root>
);
```

## snippet

支持合并多个文件的 snippet

例如：

-   文件 A

```jsx
import xml from 'solid-panorama-all-in-jsx/xml.macro';

xml(
    <snippet name="Item">
        <Panel class="Item">
            <Image />
        </Panel>
    </snippet>
);

xml(
    <root>
        <Panel></Panel>
    </root>
);
```

-   文件 B

```jsx
import xml from 'solid-panorama-all-in-jsx/xml.macro';

xml(
    <snippet name="Ability">
        <Panel class="Ability">
            <Image />
        </Panel>
    </snippet>
);
```

可以通过`formatXML`API 合并为：

```xml
<root>
    <snippets>
        <snippet name="Item">
            <Panel class="Item">
                <Image />
            </Panel>
        </snippet>
        <snippet name="Ability">
            <Panel class="Ability">
                <Image />
            </Panel>
        </snippet>
    </snippets>
    <Panel></Panel>
</root>
```

## API

```ts
interface XMLFile {
    root?: xmljs.Element;
    snippets: xmljs.Element[];
}
function getXML(filename: string): XMLFile | undefined;
function getAllCacheXML(): Record<string, XMLFile>;
function formatXML(files: XMLFile[]): string;

// 例如
import { getAllCacheXML } from 'solid-panorama-all-in-jsx/xml.macro';
console.log(getAllCacheXML());
```

# CSS

使用规则：仅支持静态数据，不支持任何动态，如字符串处理、调用函数等。

因为 PUI 不支持动态创建 css，所以这个插件所做的是把静态数据合成一个文件，然后替换成一个 class id（非全局样式），css 的模板字符串里支持引入其它由 `css.macro` 创建的 ID。

> 这个插件只是简单的合成代码，并没有进行编译，所以你可以根据自己的需求在打包工具内使用 scss 或者 less

> 如果你用的 VSCode，建议安装 [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components)，可以高亮 css 部分的代码

```jsx
import css from 'solid-panorama-all-in-jsx/css.macro';
import { OtherButton } from './other_button';

// 局部样式，这种写法会创建一个class id，如 styled-b934b0d3，根据路径和当前的顺序生成
const ButtonStyle = css`
    color: #000;
`;

// 强制使用class名称，这样将不再生成class id
// class: GlobalButton
const ButtonStyle2 = css`
    color: #000;
`;

// 全局样式，这种写法不会生成class id，这也就导致不支持上面那样直接写样式，需要包装起来。
css`
    .Group {
        flow-children: right;

        ${ButtonStyle},
        ${ButtonStyle2},
        ${OtherButton} {
            color: #fff;
        }
    }
`;

function App() {
    // 这样写会跟上面的ButtonStyle生成不一样的class id
    const ButtonStyle = css`
        color: #f00;
    `;
    return <Panel class={ButtonStyle} className={ButtonStyle2} />;
}

render(() => <App />, $('#app'));
```

## API

```ts
function getCSS(filename: string): string | undefined;
function getAllCacheCSS(): Record<string, string>;
```

# 事件

## useGameEvent

功能是自动转换为调用 solidjs 的`createEffect`

原本`useGameEvent`是`solid-panorama-runtime`的一部分，在测试中发现如果事件的监听出现跨作用域调用会导致重载时无法自动取消监听，即使传递当前作用域的`GameEvents`到另外一个作用域也是一样，如果是相同作用域在重载时底层会自动清理掉注册的事件，虽然不知道底层如何实现的，但是目前这种做法是比较稳妥的，可以达到良好的重载效果。

```jsx
import { useGameEvent } from 'solid-panorama-all-in-jsx/events.macro';

function App() {
    useGameEvent('custom_event', data => {
        console.log(data);
    });
}
```

将会转化为下面的代码

```js
var solid = require('solid-js');
function App() {
    solid.createEffect(() => {
        const id = GameEvents.Subscribe('custom_event', data => {
            console.log(data);
        });
        return () => {
            GameEvents.Unsubscribe(id);
        };
    });
}
```

## useNetTable

```js
import { useNetTable } from 'solid-panorama-all-in-jsx/events.macro';

function App() {
    const one = useNetTable('table_name', 'key_of_one');
    const two = useNetTable('table_name', 'key_of_two');
    return <Label text={JSON.stringify(one())} />;
}
```

将会转化为下面的代码

```js
var solid = require('solid-js');
function App() {
    const [one, _setOne] = solid.createSignal(
        CustomNetTables.GetTableValue('table_name', 'key_of_one')
    );
    const [two, _setTwo] = solid.createSignal(
        CustomNetTables.GetTableValue('table_name', 'key_of_two')
    );
    solid.createEffect(() => {
        const id = CustomNetTables.SubscribeNetTableListener(
            'table_name',
            function (_, k, v) {
                if (k === 'key_of_one') {
                    _setOne(v);
                } else if (k === 'key_of_two') {
                    _setTwo(v);
                }
            }
        );
        return () => {
            CustomNetTables.UnsubscribeNetTableListener(id);
        };
    });
    return <Label text={JSON.stringify(one())} />;
}
```

# 本地化文本宏

这个宏是为了实现在代码里面写本地化文本，编译后只在代码里留下字段值，同时可通过函数获得所有的本地化文本。

localize的声明，第一个是字段值，后面的参数都是各类语言的文本，另外参数对应的语言顺序参考下面的`配置语言顺序`。

```ts
function localize(token: string, ...args: string[]): void;
```

使用也很简单：

```js
import localize from 'solid-panorama-all-in-jsx/localize.macro';

// 定义字段
const token_a = localize('token_a', 'this is a', '这是a');

// 编译结果，另外第一个参数是字段值，无论有没有带`#`，都会自动加上`#`
const token_a = '#token_a';
```

### 匿名字段

上面是指定了明确的字段值，但是有些字段是具有重复性的，比如`localize("button_ok", "确定")`，如果你忘了写过这个字段能会写出别的，例如`localize("confirm_ok", "确定")`。

为了解决这个问题引入了匿名字段，只需要把第一个参数写成`#`或者空字符串即可，字段名称是根据参数中的所有文本拼合在一起取哈希值，例如 `token_76ebf07e63de6f75`

例如：

```js
import localize from 'solid-panorama-all-in-jsx/localize.macro';
const token_a = localize('', 'this is a', '这是a');
// const token_a = localize('#', 'this is a', '这是a'); // 一样的

// 编译结果
const token_a = '#token_76ebf07e63de6f75';
```

> 注意：不支持动态的字符串

### 配置语言顺序

以下是 babel-plugin-macros 的配置，如不懂可参考[官方配置文档](https://github.com/kentcdodds/babel-plugin-macros/blob/main/other/docs/user.md)

如定义 英语，简体中文，俄语

```js
[
    'macros',
    {
        'panorama-all-in-jsx': {
            localize_language_argv: ['english', 'schinese', 'russian']
        }
    }
];
```

### 获取文本

返回的字段不会带有`#`，即使`localize`的第一个参数是带有`#`也会自动忽略掉。

```js
import { getLocalizationTable } from 'solid-panorama-all-in-jsx/localize.macro';

for (const [token, data] of Object.entries(getLocalizationTable())) {
    console.log(token, data.english, data.schinese);
}
```
