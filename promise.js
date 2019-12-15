// 手写一个primise
const PENDING = 'PENDING'
const RESOLVE = 'RESOLVE'
const REJECT = 'REJECT'
class Promise {
  constructor() {
    this.status = PENDING // 默认状态
  }
  then() {}
}

export default Promise