# solid-panorama-polyfill

This library is fork from [panorama-polyfill](https://github.com/ark120202/panorama-polyfill).

这个库的使用方法跟`ark120202/panorama-polyfill`不一样，比`ark120202/panorama-polyfill`复杂一些，`ark120202/panorama-polyfill`是通过 import lib 的方式导入全局，这样的做法在只存在一个界面作用域的情况下很好，如果存在多个界面的作用域，那么不是很理想的，我的想法是把`console`和计时器的函数注入到每个界面的作用域里。

在 PUI 我们都会通过`custom_ui_manifest.xml`来指定界面入口，而 PUI 会为给每个界面独立的作用域，目的是为了编译后重载不干扰到其它界面。

```xml
<root>
    <Panel>
        <CustomUIElement type="Hud" layoutfile="file://{resources}/layout/custom_game/Hud_A.xml" />
        <CustomUIElement type="Hud" layoutfile="file://{resources}/layout/custom_game/Hud_B.xml" />
    </Panel>
</root>
```

比如上面两个 Hud 界面 Hud_A 和 Hud_B，如果 Hud_A 使用了 Hud_B 的函数，Hud_B 的函数抛出错误，那么 Error 里的调用栈是缺失的，计时器的运行也是根据所处的作用域，可以理解为每个 Hud 界面都有自己的计时器管理器，比如 Hud_B 里实现了一个`useTimer`的函数，Hud_A 使用 Hud_B 里的`useTimer`，如果 Hud_A 发生改动触发重载，此时`useTimer`不会终止依然会继续运行，因为`useTimer`所使用的计时器来自 Hud_B，而 Hud_B 没有发生重载，所以计时器需要在相同作用域下才能达到良好的重载效果。

## 使用方法

```js
import { bundlePanoramaPolyfill } from 'solid-panorama-polyfill';

async function run() {
    await bundlePanoramaPolyfill({
        output: '<your addon content path>/panorama/scripts/custom_game/panorama-polyfill.js',
        using: { console: true, timers: true }
    });
}
```

-   在`global.d.ts`中引入全局声明。

```ts
// example: src/global.d.ts
/// <reference path="../node_modules/solid-panorama-polyfill/console.d.ts" />
/// <reference path="../node_modules/solid-panorama-polyfill/timers.d.ts" />
```

-   最后在 xml 文件中使用`panorama-polyfill.js`，最好将该文件放在最前面。

```xml
<root>
    <scripts>
        <include src="file://{resources}/scripts/custom_game/panorama-polyfill.js" />
        <include src="file://{resources}/scripts/custom_game/hud_main.js" />
    </scripts>
</root>
```

### 关于console

在`ark120202/panorama-polyfill`中是使用`object-inspect`这个库对object等参数进行格式化，由于引入了太多的代码，所以移除了`object-inspect`，并对object等参数其进行了简单的格式化，另外也加入了`console.logx`，跟`console.log`不一样的地方是打印object或者array等会垂直展开，而不是打印在同一行。

## 自定义

如果你有自己的需求，可以通过`merges`选项合并代码到`output`。

```js
await bundlePanoramaPolyfill({
    output: '<your addon content path>/panorama/scripts/custom_game/panorama-polyfill.js',
    using: { console: true, timers: false },
    merges: ['./my-polyfill/timers.js']
});
```

建议将代码用 function 包裹：

```js
(function () {
    const global = new Function('return this')();
    global.myTimer = function () {};
})();
```
