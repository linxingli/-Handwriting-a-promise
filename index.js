// 使用promise
const Promise = require('./promise')

new Promise((resolve, reject) => {
  console.log('哈哈哈哈')
  resolve('成功')
}).then((data) => {
  return 1000
}, err => {
  console.log('err msg is:' + err)
}).then((data) => {
  console.log(data)
})