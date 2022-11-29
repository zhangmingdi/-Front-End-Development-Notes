### 对于babel转译es6+语法时，对于api会添加polyfill或者增加各种helper函数，如果没有这个插件@babel/plugin-transform-runtime，会出现如下问题：
  + 对于api可能会重写window与某些构造函数原型链
  + helper函数会多次定义，导致包体变大
  + <https://zhuanlan.zhihu.com/p/147083132>