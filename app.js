var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const Store = require('express-mysql-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var http = require('http');
const login = require('./routes/login');
const sign = require('./routes/sign');
const config = require('./routes/config');
const hotTopic = require('./routes/hotTopic');
var app = express();
const db_config = {
  host: '127.0.0.1', //主机
  user: 'root',     //数据库用户名
  password: 'zxwzxwzxw',     //数据库密码
  port: '3306',       
  database: 'xiyouquan', //数据库名称
  charset: 'UTF8_GENERAL_CI' //数据库编码
};
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:'xiyouquan',
  store:new Store(db_config),
  resave: false,
  saveUninitialized: true,
  cookie : {
    maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//后端请求api
app.use('/api',login);
app.use('/api',sign);
app.use('/api',config);
app.use('/api',hotTopic);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
