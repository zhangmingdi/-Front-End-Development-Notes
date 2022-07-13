### redux的简介

+ 一颗状态树
+ 通过dispatch action去调用reducer改变响应的状态
+ 组件可以通过订阅来触发组件更新

### react-redux
+ 通过Provider把store给传递下去
+ connect方法接收一个mapStateToProps和一个mapDispatchToProps方法。并返回一个函数，这个函数接收一个组件，并且返回值是一个高阶组件。 这个高阶组件主要做了以下几件事

### redux的原则
- 单一store的原则，易于跟踪调试
- 状态只读原则，改动要通过action
- 改变state要纯函数，要返回新的state

### redux-saga
+ 使用 createSagaMiddleware 方法创建 saga 的 Middleware ，然后在创建的 redux 的 store 时，使用 applyMiddleware 函数将创建的 saga Middleware 实例绑定到 store 上，最后可以调用 saga Middleware 的 run 函数来执行某个或者某些 Middleware 
+ 在 saga 的 Middleware 中，可以使用 takeEvery 或者 takeLatest 等 API 来监听某个 action ，当某个 action 触发后， saga 可以使用 call 发起异步操作，操作完成后使用 put 函数触发 action ，同步更新 state ，从而完成整个 State 的更新。


<https://juejin.cn/post/6844903517488939021>
+ state的变化全由使用者决定，没办法强制性保证state的不可变
+ 如果不使用connect的情况下，组件直接进行一个subscribe，那么每次dispatch组件都会重新render,除非你写一个让你有心智负担的shouldComponentUpdate,hooks使用者更是直接render了。