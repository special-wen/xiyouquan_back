var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.post('/reply', function(req, res, next) {
  // 判断用户是否已经登陆
  if (req.session.userInfo && req.session.userInfo) {
    let topic_id=req.body.topic_id;  
    let root_id=req.body.c_id;
    let text = req.body.content;
    let created_at = req.body.created_at;
    let uid = req.session.userInfo.uid;
    // 插入二级评论
    let insertFlowComment_sql = "insert into comment(topic_id,uid,root_id,text,created_at) values(?,?,?,?,?)";
    db.query(insertFlowComment_sql,[0,uid,root_id,text,created_at],(err,insertRst) => {
      if (err) {
        console.log(err);
        res.json({
          "ok":0,
          "data":{
            "msg":"回复失败"
          }
        })
        return;
      }
      // console.log(insertRst);
      // 回复成功
      // 获取cid
      let curCid_sql = `select AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='xiyouquan' and TABLE_NAME = 'comment'`;
      db.query(curCid_sql,(err,next_cid) => {
        if (err) {
          console.log(err);
          return
        }
        let cid = next_cid[0].AUTO_INCREMENT-1;
        // 返回改评论
        let comments = {
          "created_at":created_at,
          "cid": cid,
          "rootid":root_id,
          "uid":uid,
          "screen_name":req.session.userInfo.screen_name,
          "text":text
        }
        res.json({
          "ok":1,
          "data":{
            "flow_comment_info":comments
          }
        })
      })
    })
  } else {
    res.json({
      "ok":0,
      "data":{
        "login":false,
        "msg":"请先登陆再进行回复"
      }
    })
  }

});
module.exports = router;