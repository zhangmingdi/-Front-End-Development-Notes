### fiber初识
<https://juejin.cn/post/6844903975112671239#heading-6>

### fiber链表
<https://blog.csdn.net/u012961419/article/details/114320673>

### 稍微深入一点fiber
<https://juejin.cn/post/6943896410987659277>

### fiber对应的机构
```js
  // 现在让我们看一下 ClickCounter 组件对应的 fiber 节点的结构：
  {
    stateNode: new ClickCounter,
    type: ClickCounter,
    alternate: null,
    key: null,
    updateQueue: null,
    memoizedState: {count: 0},
    pendingProps: {},
    memoizedProps: {},
    tag: 1,
    effectTag: 0,
    nextEffect: null
  }
  //span 元素对应的 fiber 节点结构
  {
    stateNode: new HTMLSpanElement,
    type: "span",
    alternate: null,
    key: "2",
    updateQueue: null,
    memoizedState: null,
    pendingProps: {children: 0},
    memoizedProps: {children: 0},
    tag: 5,
    effectTag: 0,
    nextEffect: null
}
```
### 更新队列(updateQueue)
这是在类组件中使用的更新队列，函数组件的更新队列在 memoizedState.queue 中

### memoizedState
译者注：在类组件中，memoizedState 用于保存状态(state)，然而在函数组件中，memoizedState 用来保存 hook 链表

### memoizedProps
上一次渲染期间使用的 props

### pendingProps
新的 React element 中的数据更新后的 props，需要应用到子组件或者 DOM 元素上

