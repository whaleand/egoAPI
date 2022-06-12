const express=require('express')
const user_handler=require('../router_handler/user_.js')
const router=express.Router()
const multer=require('multer')
const path=require('path')

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,path.join(__dirname, '../uploads/user_avater/'))
  },
  filename(req, file, callback){
    let extname=path.extname(file.originalname)
    callback(null,file.fieldname+'-'+Date.now()+extname)
  }
})

const upload=multer({storage:storage})
// 注册
router.post('/register',user_handler.register_handler)

// 登录
router.post('/login',user_handler.login_handler)

// 获取用户信息
router.get('/userinfo',user_handler.userinfo_handler)

// 更改用户名
router.post('/editusername',user_handler.edit_username)

// 更改用户密码
router.post('/editpassword',user_handler.edit_password)

// 上传头像
router.post('/upload',upload.single('avater'),user_handler.upload)

// 获取用户头像
router.get('/getAvater',user_handler.getAvater)

module.exports=router