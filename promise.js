// 手写一个primise
const PENDING = 'PENDING'
const RESOLVE = 'RESOLVE'
const REJECT = 'REJECT'
const resolvePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x) {
    return reject(new TypeError('循环引用'));
  }
  if (typeof x === 'object' && x !== null || typeof x === 'function') {
    // 判断x是否为promise
  } else {
    // 普通值 直接resolve
    resolve(x)
  }
}
class Promise {
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
    // 为支持链式调用，这里需返回新的promise
    let promise2 = new Promise((resolve, reject) => {
      // 这里放到定时器里面是为了保证promise2已经实例化成功，能拿到promise2
      setTimeout(() => {
        // 这里再try catch一下是因为回调函数没办法被外层的try catch捕获异常
        try {
          // 同步 直接触发onFulfilled or onRejected返回 resolve or reject 结果
          if (this.status === RESOLVE) {
            let x = onFulfilled(this.value)
            // 该方法用于判断x的值来推导promise2的状态结果 例如：x为普通值则promise2就是RESOLVE x是异常则promise2就是REJECT，如果x是promise就由x的状态决定promise2的状态
            resolvePromise(promise2, x, resolve, reject)
          }
          if (this.status === REJECT) {
            let x = onRejected(this.value)
            resolvePromise(promise2, x, resolve, reject)
          }

          // 异步 需把onFulfilled or onRejected放到一个队列中，等待上面resolve or reject完了再执行
          if (this.status === PENDING) {
            this.onFulfilledCallbacks.push(() => {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            })
            this.onRejectedCallbacks.push(() => {
              let x = onRejected(this.value)
              resolvePromise(promise2, x, resolve, reject)
            })
          }
        } catch (error) {
          reject(error)
        }
      })
    })
    return promise2
  }
}

module.exports = Promise