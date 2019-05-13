var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.post('/create',function(req,res,next) {
  //判断用户是否登陆
  if (req.session.userInfo) {
    let back_uid = req.session.userInfo.uid;
    let uid = req.body.uid;
    let topic_id = req.body.topic_id;
    let attitude = req.body.attitude;
    let created_at = req.body.created_at;
    // 判断是否是当前用户
    if (back_uid === uid) {
      // 判断创建的类型
      if (attitude === "heart") {
        let like_sql = 'insert into `like`(uid,topic_id,isLike,created_at) values(?,?,1,?)';
        db.query(like_sql,[back_uid,topic_id,created_at],(err,result) => {
          if (err) {
            console.log("like表插入失败",err);
            return;
          }
          res.json({
            "ok":1,
            "data":{
              "msg":"success"
            }
          })
        })
      }
    }
  } 
})
module.exports = router;