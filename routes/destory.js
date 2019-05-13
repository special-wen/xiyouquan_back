var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.post('/destory',function(req,res,next) {
  //判断用户是否登陆
  if (req.session.userInfo) {
    let back_uid = req.session.userInfo.uid;
    let uid = req.body.uid;
    let topic_id = req.body.topic_id;
    let attitude = req.body.attitude;
    // 判断是否是当前用户
    if (back_uid === uid) {
      // 判断创建的类型
      if (attitude === "heart") {
        let desLike_sql = 'delete from `like` where uid=? and topic_id=?';
        db.query(desLike_sql,[back_uid,topic_id],(err,result) => {
          if (err) {
            console.log("like表删除失败",err);
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