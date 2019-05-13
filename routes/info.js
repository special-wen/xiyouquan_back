var express = require('express');
var router = express.Router();
const db = require('../mysql');
router.get('/info',function(req,res,next) {
  const uid = req.query.uid;
  //获取user的基本信息
  let userInfo_sql = 'select * from user where uid = ?';
  db.query(userInfo_sql,uid,(err,userInfo) => {
    if (err) {
      console.log(err);
      return
    }
    let user = {
      "screen_name":userInfo[0].screen_name,
      "user_header_img":userInfo[0].user_header_img,
      "uid":userInfo[0].uid
    }
    let topicCount_sql = 'select count(1) from topic where uid = ?';
    db.query(topicCount_sql,uid,(err,statuses_count) => {
      if (err) {
        console.log(err);
        return;
      }
      user.statuses_count = statuses_count[0]["count(1)"];
      res.json({
        "ok":1,
        "data":{
          "user":user
        }
      })
    });
  })  
});
module.exports = router;