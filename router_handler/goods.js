const db = require('../sql/index.js')
const path = require('path')
const exp = require('constants')

// 新增商品
exports.addGood = (req, res) => {
  // if (!req.file || req.file.fieldname !== 'good_img') return res.cc('商品封面是必选参数！')
  const goodInfo = {
    ...req.body,
    good_img: path.join('/uploads',req.file.originalname)
  }
  const sql = 'insert into goods set ?'
  db.query(sql, goodInfo, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('新增商品失败')
    res.cc('新增商品成功', 0)
  })
}

// 根据页码获取商品
exports.getGoods=(req,res)=>{
   // // 每页显示的个数
  const pageSize=req.query.pageSize
  // // 第几页
  const pageNum=req.query.pageNum
  // console.log(pageSize,pageNum);
  // // 显示开始的id
  const begin=(pageNum-1)*pageSize
  // // 显示结束的id
  const end=begin+Number(pageSize-1)
  // // const id=req.params.id
  const sql='select * from goods'
  // const sql='select * from goods'
  db.query(sql,(err,results)=>{
    if (err) return res.cc(err)
    // if(results.length!==1) return res.cc('获取失败')
    return res.send({
      message:'获取商品列表成功！',
      status:0,
      data:[results.slice(begin,end+1),results.length]
    })
  })
}

// 删除商品
exports.delete=(req,res)=>{
  const id=req.query.id
  const sql='delete from goods where id=?'
  db.query(sql,id,(err,results)=>{
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除商品失败')
    return res.cc('删除商品成功', 0)
  })
}

// 查找商品
exports.searchGoods=(req,res)=>{
  // 查找必须拼接啊啊啊
  const content="%"+req.query.content+"%"
  const pageNum=req.query.pageNum
  const pageSize=req.query.pageSize
    // // 显示开始的
    const begin=(pageNum-1)*pageSize
    // // 显示结束的
    const end=begin+Number(pageSize-1)
  
  const sql='select * from goods where good_name like ? or good_cate like ? or good_sellPoint like ? or good_descr like ?'
  db.query(sql,[content,content,content,content],(err,results)=>{
    if(err) return res.cc(err)
    return res.send({
      message:'查找商品列表成功！',
      status:0,
      data:[results.slice(begin,end+1),results.length]
    })
  })
}

// 编辑商品
exports.editGoods=(req,res)=>{
  const goodInfo = {
    ...req.body
    // good_img: path.join('/uploads', req.file.filename)
  }
  const sql = 'update goods set ? where id=?'
  db.query(sql, [goodInfo,req.body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('编辑商品失败')
    res.cc('编辑商品成功', 0)
  })

}