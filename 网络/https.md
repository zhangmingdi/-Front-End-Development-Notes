### 通俗的https
<https://juejin.cn/post/6925296374628122632>
### 对称加密
<https://github.com/lizuncong/Front-End-Development-Notes/blob/master/%E5%89%8D%E7%AB%AF%E7%9F%A5%E8%AF%86%E4%BD%93%E7%B3%BB(%E5%85%A8%E9%9D%A2)/%E7%BD%91%E7%BB%9C/https%E7%AE%80%E4%BB%8B%E5%8F%8A%E4%B8%8Ehttp%E7%9A%84%E5%8C%BA%E5%88%AB.md>
#### https是什么？
+ http基础上增加的一层加密协议。
+ 客户端向服务端请求一把公钥，拿到公钥必须得是CA 机构认证处理过的数字证书(防止中间人伪造公钥),同时该证书必须得绑定一个域名(防止中间人也向CA机构伪造一个数字证书)
+ 客户端公钥加密数据，服务端的私钥就可以解密数据。

#### https的过程
+ TCP三次握手建立连接
+ 客户端通过URL访问服务器建立SSL连接
+ 服务端生成公钥和私钥，并通过证书加密发给客户端
+ 系统内置可以解析被CA机构处理过的公钥，
