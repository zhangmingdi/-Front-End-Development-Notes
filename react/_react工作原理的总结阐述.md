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

### render阶段的四个函数的作用
+ performUnitOfWork
+ beginWork
  - 对当前fiber节点(state)进行更新以及执行相关生命周期，里面会调用finishClassComponent进行子节点的diff（子元素的props更新是在父组件中完成的），并返回下一个子工作单元节点。
+ completeUnitOfWork
  - 如果beginwork返回null，代表没有子单元节点，那么回溯到该单元节点兄弟节点，除此之外还完成了构建副作用链表的功能
+ completeWork
  - 当一个fiber节点的子节点全部完成工作后就会进行回溯到fiber节点，调用此函数完成该节点的回溯
```js
function performUnitOfWork(workInProgress) {
  let next = beginWork(workInProgress);
  if (next === null) {
    next = completeUnitOfWork(workInProgress);
  }
  return next;
}

function beginWork(workInProgress) {
  console.log("work performed for " + workInProgress.name);
  return workInProgress.child;
}

function completeUnitOfWork(workInProgress) {
  while (true) {
    let returnFiber = workInProgress.return;
    let siblingFiber = workInProgress.sibling;

    //回溯该工作fiber
    nextUnitOfWork = completeWork(workInProgress);

    if (siblingFiber !== null) {
      // If there is a sibling, return it
      // to perform work for this sibling
      return siblingFiber;
    } else if (returnFiber !== null) {
      // If there's no more work in this returnFiber,
      // continue the loop to complete the parent.
      workInProgress = returnFiber;
      continue;
    } else {
      // We've reached the root.
      return null;
    }
  }
}

```
##### 1.4.2 commit 阶段

commit 阶段是同步的，一旦开始就不能再中断。这个阶段遍历副作用链表并执行真实的 DOM 操作。commit 阶段分为 `commitBeforeMutationEffects`、`commitMutationEffects` 以及 `commitLayoutEffects` 三个子阶段。每个子阶段都是一个 while 循环。同时，**每个子阶段都是从头开始遍历副作用链表！！！**

- commitBeforeMutationEffects。DOM 变更前。这个阶段除了类组件以外，其他类型的 fiber 节点几乎没有任何处理
  - 调用类组件实例上的 getSnapshotBeforeUpdate 方法
- commitMutationEffects。操作真实的 DOM
  - 对于 HostComponent
    - 更新 dom 节点上的 `__reactProps$md9gs3r7129` 属性，这个属性存的是 fiber 节点的 props 值。这个属性很重要，主要是更新 dom 上的 onClick 等合成事件。由于事件委托在容器 root 上，因此在事件委托时，需要通过 dom 节点获取最新的 onClick 等事件
    - 更新发生了变更的属性，比如 style 等
  - 对于 HostText，直接更新文本节点的 nodeValue 为最新的文本值
  - 对于类组件，则什么都不做。
- commitLayoutEffects。DOM 变更后。
  - 对于 HostComponent，判断是否需要聚焦
  - 对于 HostText，什么都没做
  - 对于类组件
    - 初次渲染，则调用 componentDidMount，以及对应的useEffect 和useLayoutEffect 
    - 更新则调用 componentDidUpdate
    - 调用 this.setState 的 callback