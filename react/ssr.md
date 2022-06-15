### 1.为什么需要SSR?
+ SSR指服务端渲染
+ 更快的首屏加载速度：无需等待 JavaScript 完成下载且执行才显示内容，更快速地看到完整渲染的页面，有更好的用户体验。
+ 更友好的 SEO：客户端渲染(CSR)首次返回的 HTML 文档中，是空节点（root）；而 SSR 返回渲染之后的 HTML 片段，内容完整，所以能更好地被爬虫分析与索引。

### 2.缺点
+ 对服务器性能消耗较高
+ 项目复杂度变高，出问题需要在前端、node、后端三者之间找

### 3.什么是SSR
>#### (1).首先明白看一下客户端渲染(CSR)的流程（图片转自掘金）
![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/9/16eeb56642155f21~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)
>#### (2).SSR的过程
![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/9/17/16d3ea2efbfc1270~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)


- 反正一句话总结就是，根据请求的路由服务器帮你先写好html文段(包括css)，以及提前请求数据并填充好数据，要的是这个结果，过程的实现也不局限于一种方法。

### 4.SSR核心理念:同构
>#### (1).什么是同构?(2).为什么需要同构呢
+ 客户端拿到服务端拼的html片段之后，首次加载的bundle.js还要继续执行一遍，所以要保证服务器渲染的东西与bundle.js渲染的dom保持一致，不然就会出现闪现效果或者直接报错。
+ 先来看一个最简单的ssr案例(react+ssr)下面只贴重点代码

```javascript
// 前端入口文件
import React from 'react';
import ReactDom from 'react-dom';
import Home from './pages/home/index';

ReactDom.hydrate(
  <Home />,
  document.getElementById('root'),
);
```

```javascript
// node端
import React from 'react';
import { renderToString } from 'react-dom/server';
import Home from '../../client/pages/home';

export default async (req, res, next) => {
  const { paht, url } = req;

  if (url.indexOf('.') > -1) {
    return;
  }
  const reactStr = renderToString(<Home />);

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title></title>
  </head>
  <body>
      <div id="root">${reactStr}</div>
  </body>
  <script type="text/javascript" src="/index.js"></script>
  </html>`;
  res.send(html);

  return next();
};
```
>#### (2).问题服务端渲染之后，客户端又继续渲染一遍？认识一下同构的核心api：renderToString与ReactDom.hydrate；此处贴一下官方文档如下
+ renderToString：将一个 React 元素渲染成其初始的 HTML。React 将返回一个 HTML 字符串。你可以使用这种方法在服务器上生产 HTML，并在初始请求中发送标记。以加快页面加载速度，并允许搜索引擎以 SEO 为目的抓取你的页面。

+ hydrate：如果你在一个已被服务端渲染标记的节点上调用 ReactDOM.hydrateRoot()，React 会保留它，只附加事件处理程序，让你有一个非常良好的首次加载体验

+ 就是这两个api保证了同构的相似性：前者画好了静态html片段，后者不再重新生成服务端写好的html，而会为元素添加相关交互事件。

### 5.路由同构
```javascript
// 组件
// routeConfigsArr的结构就是最基本的路由配置
// [{
//     path: '/',
//     exact: true,
//     name: 'Home',
//     component: Home,
//   },]
//下面是常见的路由配置
  <Switch>
      {
          routeConfigsArr.map((v) => {
            const { name, ...rest } = v;
            return (
              <RouteWithSubRoutes
                key={v.path}
                {...v}
              />
            );
          })
        }
    </Switch>
```


```javascript
// 组件
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';

export default async (req, res, next) => {
  const { path, url } = req;
  if (url.indexOf('.') > -1) {
    return;
  }
  //请求路径

  const reactStr = renderToString(
    //path请求路径取匹配组件
    <StaticRouter location={path}>
      <RootView />
    </StaticRouter>,
  );
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title></title>
  </head>
  <body>
      <div id="root">${reactStr}</div>
  </body>
  <script type="text/javascript" src="/index.js"></script>
  </html>`;
  res.send(html);

  return next();
};
```
+ 路由同构就是保证不同url请求匹配上不同的页面组件

### 6.数据同构
+ 首先ssr阶段先请求拿到数据，再同构context把数据传给组件
+ 接着注水把数据注入到Html
+ 客户端渲染时通过html文段拿到注水的数据，通过props或其他形式传下去
+ 组件useEffect阶段通过判断初始数据来判断是否再次请求接口
+ 直接看代码

### 7.css同构（遇到报错，卡了很久，还是没解决，欢迎一起探讨解决）
+ 客户端可以同过style-loader帮你插入css,而服务端要手动插入css
+ 思路就是服务端收集css再去插入到html里面，核心是isomorphic-style-loader的使用
+  It provides two helper methods on to the styles object - ._insertCss() (injects CSS into the DOM) and ._getCss() (returns a CSS string)
+ 大体意思是它让你的css对象拥有两个方法_insertCss()与_getCss()，重点关注_getCss()即返回css字符串给你(看一下log)
+ StyleContext与自定义钩子useStyles实现了收集的过程



### 8.结尾
+ 很多技术细节，需要去码一遍比较好。
+ 支持懒加载组件(本期代码已完成，下期再讲)。
+ 引入redux或者其他store库去同构数据(代码还没写到此部分，同下期讲解)。

## 其它
### 代码：<https://github.com/zhangmingdi/ssr>
### 文章
+ <https://juejin.cn/post/6864176533549318152>
+ <https://juejin.cn/post/6844903943902855176>
+ <https://juejin.cn/post/6844903694870265870>
+ <https://blog.csdn.net/xiaohulidashabi/article/details/105315953>

