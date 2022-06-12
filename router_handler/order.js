const { array } = require('joi')
const { Random } = require('mockjs')
const Mock = require('mockjs')

// 获取目前订单信息，提供参数，1表示全部订单，2只要退货订单
// 订单状态：1：待发货，2：待收货，3：待退货，4：已退货,5:交易完成
exports.getOrder = (req, res) => {
  const num = req.query.num
  const states = ['待发货', '待收货', '待退货', '已退货', '交易完成']
  const reason = ['质量问题', '不喜欢、不满意', '尺码不合适']
  const orders = [
    Mock.mock({ id: 1, good_name: '纽西之谜清洁面膜南极冰藻涂抹式 ', good_count: Random.integer(1, 10), good_price: Random.float(5, 150).toFixed(2), "state|1": states })
    ,
    Mock.mock({ id: 2, good_name: '三月兔marchare13支专业化妆刷 ', good_count: Random.integer(1, 10), good_price: Random.float(5, 150).toFixed(2), "state|1": states })
    ,
    Mock.mock({ id: 3, good_name: '三月兔Marchare假面狮美妆蛋礼盒2个装', good_count: Random.integer(1, 10), good_price: Random.float(5, 150).toFixed(2), "state|1": states }),
    Mock.mock({ id: 4, good_name: 'JudydoLL/橘朵水雾唇釉', good_count: Random.integer(1, 10), good_price: Random.float(5, 150).toFixed(2), "state|1": states }),
    Mock.mock({ id: 5, good_name: '滋源玫瑰精油柔顺保湿洗发水露膏', good_count: Random.integer(1, 10), good_price: Random.float(5, 150).toFixed(2), "state|1": states }),
    Mock.mock({ id: 6, good_name: '妮维雅男士小蓝管护肤温和补水', good_count: Random.integer(1, 10), good_price: Random.float(5, 150).toFixed(2), "state|1": states }),
    Mock.mock({ id: 7, good_name: '时尚新款女士简约透明学生皮带', good_count: Random.integer(1, 10), good_price: Random.float(5, 150).toFixed(2), "state|1": states }),
    Mock.mock({ id: 8, good_name: '新款复古美式学院格子娃娃泡泡', good_count: Random.integer(1, 10), good_price: Random.float(5, 150).toFixed(2), "state|1": states }),
    Mock.mock({ id: 9, good_name: '2022新款复古印花短袖设计感小众', good_count: Random.integer(1, 10), good_price: Random.float(5, 150).toFixed(2), "state|1": states }),

  ]
  orders.forEach((item) => {
    item.payment = (item.good_count * item.good_price).toFixed(2)
  })
  if (num == 1) {
    return res.send({
      status: 0,
      message: '获取订单信息成功！',
      orders
    })
  }

  if (num == 2) {
    return res.send({
      status: 0,
      message: '获取订单信息成功！',
      orders: orders.filter(item => {
        return item.state == '待退货'
      }).map(item => {
        return Mock.mock({
          ...item,
          "reason|1": reason
        })
      })
    })
  }
}

// 获取销量及统计信息
exports.getSales = (req, res) => {
  Random.integer(10, 150)
  const sale = [
    {
      id: 1, cate: '食品', volume: [Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150)]
    },
    { id: 2, cate: '化妆品', volume: [Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150)] },
    { id: 3, cate: '书籍', volume: [Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150)] },
    { id: 4, cate: '服饰', volume: [Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150)] },
    { id: 5, cate: '百货', volume: [Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150), Random.integer(10, 150)] }
  ]
  sale.forEach((item) => {
    item.allVolume = item.volume.reduce((a, i) => a + i, 0)
  })
  return res.send({
    status: 0,
    message: '获取订单信息成功！',
    sale
  })
}