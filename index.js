// 使用promise
new Promise((resolve, reject) => {
  console.log('哈哈哈哈')
  reject('失败')
  resolve('成功')
}).then((data) => {
  console.log(data)
}, err => {
  console.log('err msg is:' + err)
})