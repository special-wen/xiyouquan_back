var express = require('express');
var router = express.Router();
const db = require('../mysql');
router.post('/change', function(req,res,next) {
  let uid=req.body.uid;  
  let type = req.body.type;
  if (type === "user_info") {
    let screen_name=req.body.screen_name;
    let user_header_img = req.body.user_header_img;
    let updateInfo_sql = 'update user set screen_name = ?, user_header_img = ? where uid = ?'
    db.query(updateInfo_sql,[screen_name,user_header_img,uid],(err,update_info) => {
      if (err) {
        console.log(err)
        res.json({
          "ok":0,
          "data":{
            "msg":"修改失败，请重试"
          }
        })
      } else {
        // 查找更新后的用户信息
        let userInfo_sql = 'select * from user where uid = ?';
        db.query(userInfo_sql,uid,(err,user) => {
          if (err) {
            console.log(err)
            return;
          }
          let user_info = {};
          user_info.uid = user[0].uid;
          user_info.tel = user[0].user_tel;
          user_info.screen_name = user[0].screen_name;
          user_info.user_header_img =user[0].user_header_img;
          console.log(user_info,'===')
          req.session.userInfo = user_info;
          res.json({
            "ok":1,
            "data":{
              "msg":"修改成功"
            }
          })
        })
      }
    })
  } else if (type === "pass_word") {
    let password = req.body.password;
    let updatePass_sql = 'update user set user_pass = ? where uid = ?';
    db.query(updatePass_sql,[password,uid],(err,update_pass) => {
      if (err) {
        console.log(err);
        res.json({
          "ok":0,
          "data":{
            "msg":"修改密码，请重试"
          }
        })
      } else {
          res.json({
            "ok":1,
            "data":{
            "msg":"修改成功"
            }
          })
        }
    })
  }
})
module.exports = router;