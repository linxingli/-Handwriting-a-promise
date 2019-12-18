// 手写一个primise
const PENDING = 'PENDING'
const RESOLVE = 'RESOLVE'
const REJECT = 'REJECT'
class MyPromise {
  constructor(executor) {
    this.status = PENDING // 默认状态
    this.value = undefined // 返回结果
    this.onFulfilledCallbacks = [] // 异步场景时成功的回调
    this.onRejectedCallbacks = [] // 异步场景时失败的回调
    let resolve = (value) => {
      // 只有当前状态为pending时才能变为成功
      if (this.status === PENDING) {
        this.status = RESOLVE
        this.value = value
        this.onFulfilledCallbacks.forEach(fn => fn())
      }
    }
    let reject = (reason) => {
      // 只有当前状态为pending时才能变为成功
      if (this.status === PENDING) {
        this.status = REJECT
        this.value = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    // 同步 直接触发onFulfilled or onRejected返回 resolve or reject 结果
    if (this.status === RESOLVE) {
      onFulfilled(this.value)
    }
    if (this.status === REJECT) {
      onRejected(this.value)
    }

    // 异步 需把onFulfilled or onRejected放到一个队列中，等待上面resolve or reject完了再执行
    if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.value)
      })
    }
  }
}

module.exports = MyPromise