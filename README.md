# Solid.js for Valve's Panorama UI

尚在实验阶段

魔改了编译，针对 PUI 的 API 进行了优化，比如`createElement`加入属性和父元素两个参数，就极大减少了过多的 API 调用，也解决了无法调用`$.CreatePanelWithProperties`的问题。

## style

需要注意 PUI 内元素的 style 跟 web 是不同的，PUI 的 style 是只能对单个 css 属性进行读写，style 不能进行遍历，
也不能通过字符串设置 style，因为不具备类似`style.cssText`这样的赋值方法，所以为了兼容这一行为进行了解析，然后挨个设置进 style 里面。

总之为了最好的性能最好是这样写`<Panel style={{width:'12px'}}>`

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

PUI 的元素事件与 WEB 的完全不同，PUI 是较为简单的，而且绝大多数情况下也不需要向上冒泡，所以不会支持事件冒泡的功能，如果用 capture 类的事件会抛出错误。

## 不支持 Fragment

形如`<> </>`就是 Fragment，由于会在编译时无法识别父元素所以不支持，也许以后可以，至少目前对 babel 的理解太浅，尚不知如何做。

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
