var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.post('/login', function(req, res, next) {
  let user_name=req.body.username;  
  let password=req.body.password;
  let sql = `select * from user where user_tel=`+user_name+`;`;
  db.query(sql,(err,rst) => {
    if (rst.length === 0) {
      console.log("该帐号没有注册过");
      res.json({
        "ok":0,
        "data":{
          "msg":"该帐号没有注册过，请注册！"
        }
      })
    } else {
      const user = rst[0];
      if (user.user_pass === password) {
        console.log("登陆成功")
        let user_info = {};
        user_info.uid = user.uid;
        user_info.tel = user.user_tel;
        user_info.screen_name = user.screen_name;
        user_info.user_header_img =user.user_header_img;
        req.session.userInfo = user_info;
        res.json({
          "ok":1,
          "data":{
            "user_info":user_info,
            "msg":"登陆成功！"
          }
        })
      } else {
        console.log("用户名密码不匹配")
        res.json({
          "ok":0,
          "data":{
            "msg":'用户名密码不匹配，请重新登陆！'
          }
        })
      }
    }
  })
});
module.exports = router;