const sql=require('mysql')

const db=sql.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'admin123',
  database:'my_db_02',
  // 数据库默认是3306
})

module.exports=db