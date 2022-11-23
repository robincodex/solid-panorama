# solid-panorama-polyfill

This library is fork from [panorama-polyfill](https://github.com/ark120202/panorama-polyfill).

这个库的使用方法跟`ark120202/panorama-polyfill`不一样，比`ark120202/panorama-polyfill`复杂一些，我的想法是把`console`和计时器的函数注入到每个界面里，在 PUI 里每个界面都有自己独立的作用域，比如有两个 Hud 界面 Hud_A 和 Hud_B，如果 Hud_A 使用了 Hud_B 的函数，Hud_B 的函数抛出错误，那么 Error 里的调用栈是缺失的，计时器的运行也是根据所处的作用域，可以理解为每个 Hud 界面都有自己的计时器管理器，比如 Hud_B 里实现了一个`useTimer`的函数，Hud_A 使用 Hud_B 里的`useTimer`，如果 Hud_A 发生改动触发重载，此时`useTimer`不会终止依然会继续运行，因为`useTimer`所使用的计时器来自 Hud_B，而 Hud_B 没有发生重载，所以计时器需要在相同作用域下才能达到良好的重载效果。

## 使用方法

-   首先在`dota_addons/<addon>/panorama/scripts/custom_game`目录下创建一个 js 文件，假设取名`panorama-polyfill.js`，
-   根据你的需要将`solid-panorama-polyfill/console.js`或者`solid-panorama-polyfill/timers.js`复制到`panorama-polyfill.js`里面
-   在`global.d.ts`中引入全局声明。

```ts
// src/global.d.ts
/// <reference path="../node_modules/solid-panorama-polyfill/console.d.ts" />
/// <reference path="../node_modules/solid-panorama-polyfill/timers.d.ts" />
```

-   最后在 xml 文件中使用`panorama-polyfill.js`，最好将该文件放在最前面。

```xml
<root>
    <scripts>
        <include src="file://{resources}/scripts/custom_game/panorama-polyfill.js" />
    </scripts>
</root>
```
