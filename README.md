# Solid.js for Valve's Panorama UI

尚在实验阶段

## style

需要注意 PUI 内元素的 style 跟 web 是不同的，PUI 的 style 是只能对单个 css 属性进行读写，style 不能进行遍历，
也不能通过字符串设置 style，因为不具备类似`style.cssText`这样的赋值方法，所以为了兼容这一行为进行了解析，然后挨个设置进 style 里面。

总之为了最好的性能最好是这样写`<Panel style={{width:'12px'}}>`

## 事件

PUI 的元素事件与 WEB 的完全不同，PUI 是较为简单的，而且绝大多数情况下也不需要向上冒泡，所以不会支持事件冒泡的功能，如果用 capture 类的事件会抛出错误。
