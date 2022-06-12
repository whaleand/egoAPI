const express=require('express')
const router =express.Router()
const handler=require('../router_handler/order.js')

// 获取目前订单信息
router.get('/getorder',handler.getOrder)

// 获取各类销量及统计信息
router.get('/getsales',handler.getSales)

// 查看某一件商品销量信息
module.exports=router