### render阶段的四个函数的作用
+ performUnitOfWork
+ beginWork
  - 对当前fiber节点进行更新，并返回下一个子工作单元节点。
+ completeUnitOfWork
  - 如果beginwork返回null，代表没有子单元节点，那么回溯到该单元节点兄弟节点
+ completeWork
  - 当一个fiber节点的字节点全部完成工作后就会进行回溯到fiber节点，调用此函数完成该节点的回溯
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

```