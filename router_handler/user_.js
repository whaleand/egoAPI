const db = require('../sql/index.js')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
const config = require('../config.js')
// 注册处理函数
exports.register_handler = (req, res) => {
  const info = req.body

  //  检查用户名是否被占用
  const sql = 'select * from users where username=?'

  db.query(sql, info.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length > 0) {
      return res.cc('用户名被占用')
    }
    // 用户名可用
    const sql = 'insert into users set ?'
    db.query(sql, info, (err, results) => {
      if (err) return res.cc
      if (results.affectedRows !== 1) return res.cc('添加用户失败')
      return res.cc('注册成功！', 0)
    })

  })
}

// 登录处理函数,{username，password}
exports.login_handler = (req, res) => {
  const info = req.body
  const sql = 'select * from users where username=?'
  db.query(sql, info.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('用户名不存在')
    if (results[0].password !== info.password) {
      return res.cc('密码错误！')
    }
    const user = { ...results[0], password: '' }
    const jwtToken = jwt.sign(user, config.jwtKey, { expiresIn: config.expiresIn })
    return res.send({
      massage: '登录成功',
      status: 0,
      user: results[0].username,
      token: 'Bearer ' + jwtToken
    })
  })
}

// 登录后获取用户信息,只需要一个token,注意要加在headers：{authorization：}
exports.userinfo_handler = (req, res) => {
  const token = req.headers.authorization.split(' ').pop();
  if (!token) {
    return res.cc('请先登录！')
  }
  const verify = jwt.verify(token, config.jwtKey)
  if (!verify) {
    return res.cc('请登录！')
  }
  const id = verify.id
  const sql = 'select * from users where id=?'

  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取用户信息失败')
    let userinfo = { ...results[0] }
    if (results[0].avater) {
      userinfo.avater = 'http://localhost:3020/api/getAvater?id=' + results[0].id
    }
    if (results[0].user_desc == '超级管理员') {
      const sql2 = 'select * from users'
      db.query(sql2, (err, results) => {
        userinfo.memberInformation = results
        return res.send({
          message: '获取用户信息成功！',
          status: 0,
          userinfo
        })
      })
    } else {
      return res.send({
        message: '获取用户信息成功！',
        status: 0,
        userinfo
      })
    }

    // if (results[0].avater) {
    //   return res.send({
    //     message: '获取用户信息成功！',
    //     status: 0,
    //     userinfo: {
    //       ...results[0],
    //       avater:'http://localhost:3020/api/getAvater?id='+results[0].id
    //     }
    //   })
    // } else {
    //   return res.send({
    //     message: '获取用户信息成功！',
    //     status: 0,
    //     userinfo: {
    //       ...results[0],
    //     }
    //   })
    // }
  })
}

// 更改用户名,需要传入对象，包含新用户名和id
exports.edit_username = (req, res) => {
  // const newInfo = {
  //   username,
  //   // avater: path.join('/uploads/user_avater/', req.file.filename)
  // }
  const username = req.body.username
  const sql = 'update users set username= ? where id=?'
  db.query(sql, [username, req.body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更改用户名失败')
    res.cc('更改用户名成功', 0)
  })
}

// 更改用户密码，需要传入对象{oldPassword，newPassword，id}
exports.edit_password = (req, res) => {
  const { oldPassword: old, newPassword: n, id } = req.body
  const sql = 'select * from users where id=?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results[0].password !== old) {
      return res.cc('密码错误！')
    }
    let sql = 'update users set password=? where id=?'
    db.query(sql, [n, id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新密码失败')
      res.cc('更新密码成功', 0)
    })
  })
}
// 上传头像，需要token以及{avater：}
exports.upload = (req, res) => {
  const token = req.headers.authorization.split(' ').pop();
  if (!token) {
    return res.cc('请先登录！')
  }
  const verify = jwt.verify(token, config.jwtKey)
  const id = verify.id
  const img = path.join('/uploads/user_avater/', req.file.filename)

  // console.log(req.file);
  const sql = 'update users set avater=? where id=?'
  db.query(sql, [img, id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更改用户头像失败')
    return res.send({
      message: '更改用户头像成功！',
      status: 0
    })
  })

}

// 获取头像
exports.getAvater = (req, res) => {

  const id = req.query.id
  const sql = 'select * from users where id=?'
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取头像失败')
    const img = results[0].avater
    // console.log(img);
    const pa = path.join(__dirname, '../', img)
    fs.readFile(pa, (err, data) => {
      if (err) {
        return res.cc(err)
      } else {
        return res.send(data)
      }
    })
  })
}