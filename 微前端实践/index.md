### qiankun的加载方式 <https://zhuanlan.zhihu.com/p/379744976>
<https://juejin.cn/post/7125330793139798047>
  + import-html-entry 解析 html，获取 JavaScript, CSS, HTML
  + 创建容器 container，同时加上 css 样式隔离：在 container 上添加 Shadow DOM 或者对 CSS 文本 添加前缀实现 Scoped CSS
    - 
  + 创建沙箱，监听 window 的变化，并对一些函数打上补丁
  + 提供更多的生命周期，在 beforeXXX 里注入一些 qiankun 提供的变量
  + 返回带有 bootstrap, mount, unmount 属性的对象


### micro-app好用的一款微前端：原理实现
<https://github.com/micro-zoe/micro-app/issues/17>
