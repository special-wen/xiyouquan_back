//mysql.js
var mysql = require('mysql'); //调用MySQL模块
//创建一个connection
var connection = mysql.createConnection({
  host: '127.0.0.1', //主机
  user: 'root',     //数据库用户名
  password: 'zxwzxwzxw',     //数据库密码
  port: '3306',       
  database: 'xiyouquan', //数据库名称
  charset: 'UTF8_GENERAL_CI' //数据库编码
});

module.exports = connection  