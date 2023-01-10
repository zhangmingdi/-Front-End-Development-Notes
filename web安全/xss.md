### 跨站脚本攻击 XSS（Cross Site Scripting）
  + 跨站脚本的危害：获取页面数据，获取Cookies，劫持前端逻辑(比如修改某个按钮的点击事件)，发送请求
#### 分类
   + 存储型：恶意代码存储在数据库中，当用户访问网站时，服务器返回給浏览器
     - 例子： 攻击者将恶意代码提交到目标网站的数据库中。网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器，常见有论坛发帖、商品评论、用户私信
   + 反射型：通过在URL参数里面插入攻击代码的方式注入。比如微博的搜索，在搜索框输入搜索关键字后，要在页面显示用户的搜索关键字及搜索结果，攻击者在url里注入恶意代码，并诱导用户点击，服务器将url里的恶意代码插入html中返回给浏览器
     - 例子：攻击者构造一个链接：http://localhost:3001/?keyword=<script>alert(1)</script>China。并传给浏览器，此时浏览器执行恶意代码弹出1。攻击者通过构造链接，还可以植入第三方网站脚本：http://localhost:3001/?keyword=<script src="http://cdn.jquery.js"></script>China。
      甚至，攻击者嵌入自己的脚本，<script src="http://my.attack.js"></script>
   + DOM型
    - 与反射性XSS一样，只不过是前端 JavaScript 取出 URL 中的恶意代码并执行

### 反射XSS、存储XSS与DOM型XSS的区别
  + 存储型 XSS 的恶意代码存在数据库里，反射型 XSS 的恶意代码存在 URL 里
  + 反射型 XSS 漏洞常见于通过 URL 传递参数的功能，如网站搜索、跳转等，需要用户主动打开恶意的 URL 才能生效

### XSS防范
  + 预防存储型和反射型 XSS 攻击
   - 改成纯前端渲染，把代码和数据分隔开。
   - 对 HTML 做充分转义。
  + 预防 DOM 型 XSS 攻击
   - 用 Vue/React 技术栈，谨慎使用v-html/dangerouslySetInnerHTML

