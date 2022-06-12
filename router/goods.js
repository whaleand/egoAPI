const express = require('express')
const router = express.Router()
const handler = require('../router_handler/goods.js')
const path = require('path')

const multer = require('multer')
const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,path.join(__dirname, '../uploads/'))
  },
  filename(req, file, callback){
    callback(null,file.originalname)
  }
})
const uploads = multer({ storage:storage })
// 新增商品
router.post('/addgoods', uploads.single('good_img'),handler.addGood)
// 获取商品
router.get('/getgoods', handler.getGoods)
// 根据内容查找商品
router.get('/searchgoods', handler.searchGoods)
// 删除商品
router.get('/deletegoods',handler.delete)
// 编辑商品
router.post('/editgoods', uploads.single('good_img'),handler.editGoods)

module.exports = router