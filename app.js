const express = require('express')
const cors = require('cors')
const expressJWT = require('express-jwt')


const app = express()
app.use('/uploads',express.static('./uploads'))

app.use(cors())
app.use(express.urlencoded({ extended: false }))
const config = require('./config')
const res = require('express/lib/response')
// 此处利用正则写不需要token认证的页面
// app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: /^\/api/ }))

// res.cc定义
app.use((req, res, next) => {
  // 发生错误为1，否则为0
  res.cc = (err, status = 1) => {
    return res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 路由
// 用户路由
const user=require('./router/user.js')
app.use('/api',user)
// 商品路由
const goods=require('./router/goods.js')
app.use('/api',goods)
// 订单路由
const order=require('./router/order.js')
app.use('/api',order)



// 错误级别中间件
app.use((err, req, res, next) => {
  // if (err instanceof Joi.ValidationError) {
  //   return res.cc(err)
  // }

  if (err.name === 'UnauthorizedError') {
    return res.cc('身份认证失败')
  }
  return res.cc(err)

})

app.listen(3020, () => {
  console.log('server running at http://localhost:3020');
})