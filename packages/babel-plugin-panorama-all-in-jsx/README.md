# Panorama all in jsx

这个插件的目的是将 xml 和 css 都放入 jsx 或者 tsx 中，当然这不一定符合你的习惯，选择使用即可；

这个插件是基于`babel-plugin-macros`开发的，所以只要你用了 babel 编译代码即可，本项目目前没有计划提供打包工具的插件，但是提供了 API 接口。

# XML

xml 是基于 jsx 实现的，将 jsx 转换成 xml，需要注意这里不支持动态的变量等，你需要把这部分当作一个 xml 文件去写。

```jsx
import xml from 'babel-plugin-panorama-all-in-jsx/xml.macro';

xml(
    <root>
        <styles>
            <include src="s2r://panorama/styles/dotastyles.vcss_c" />
            <include src="file://{resources}/styles/custom_game/hud_main.css" />
        </styles>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/hud_main.js" />
        </scripts>
        <Panel>
            <Panel id="app" />
        </Panel>
    </root>
);
```

## API

```ts
function getXML(filename: string): xmljs.Element | undefined;
function getAllCacheXML(): Record<string, xmljs.Element>;
function formatXML(root: xmljs.Element): string;

// 例如
import { getAllCacheXML } from 'babel-plugin-panorama-all-in-jsx/xml.macro';
console.log(getAllCacheXML());
```

# CSS

如果你使用过 styled-component，那应该会比较容易理解，不过目前支持的功能并不如 styled-component，后续会依据情况调整。

> 如果你用的 VSCode，建议安装 [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components)

```jsx
import css from '../packages/babel-plugin-panorama-all-in-jsx/css.macro';

// 局部样式，这种写法会创建一个class id，如 styled-b934b0d3，根据路径和变量名生成
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
function getScss(filename: string): string | undefined;
function getAllCacheScss(): Record<string, string>;
```
