var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.post('/sign', function(req, res, next) {
  let user_name=req.body.username;  
  let password=req.body.password;
  let sql = `select * from user where user_tel=?`;
  db.query(sql,user_name,(err,rst) => {
    if (rst.length === 0) {
      console.log("注册帐号");
      let sing_sql = 'insert into user(user_tel,screen_name,user_pass,user_header_img) values(?,?,?,?)';
      db.query(sing_sql,[user_name,user_name,password,''],(err,rst) => {
        if (err) {
          console.log('失败');
          res.json({
            "ok":0,
            "data":{
              "msg":"注册失败，请重试"
            }
          })
        } else {
          console.log('成功');
          let sql = 'select * from user where user_tel=?';
          db.query(sql,user_name,(err,rst) => {
            if (err) {
              console.log("查询失败",err)
            }else {
              console.log('===');
              const user = rst[0];
              let user_info = {};
              user_info['uid'] = user.uid;
              user_info['tel'] = user.tel;
              user_info['screen_name'] = user.screen_name;
              user_info['user_header_img'] =user.user_header_img;
              req.session.userInfo = user_info;
              res.json({
                "ok":1,
                "data":{
                  "user_info":user_info,
                  "msg":"注册并登陆成功！"
                }
              })
            }
          })
        }
      })
    } else {
      console.log("该账户已注册")
      res.json({
        "ok":0,
        "data":{
          "msg":"该账户已注册，请直接登陆"
        }
      })
    }
  });
});
module.exports = router;