// const http = require('http');
var express = require('express');
var router = express.Router();
// const connection = require('../mysql');//导入mysq配置文件

// //创建一个connection连接
// connection.connect(function(err) {
//   if (err) {
//     console.log('[query] - :' + err);
//       return;
//     }
//   console.log('[connection connect]  succeed!'); //如果连接成功 控制台输出 success 了
// });


router.get('/login', function(req, res,next) {
  // res.render('login',{title:123})
  console.log('abs');
  // var res = res;
  // var req = req;

  // //执行SQL语句,这里是一条简单的MySQL查询语句
  var sql = "select * from user_info;";
  connection.query(sql, function(err, rows, fields) {
    console.log('===')
    if (err) {
      console.log('[query] - :' + err);
      return;
    }
    console.log(rows)
    res.send(rows)  //这里在页面上输出数据
    console.log('The solution is: ', rows[0].solution);
  });
})
module.exports = router;