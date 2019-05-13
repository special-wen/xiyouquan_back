var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.post('/edit', function(req, res, next) {
  // 判断用户是否已经登陆
  if (req.session.userInfo && req.session.userInfo) {
    let text = req.body.text;
    let created_at = req.body.created_at;
    let type = req.body.type;
    let uid = req.session.userInfo.uid;
    
    // 插入topic信息 
    let insertFlowComment_sql = "insert into topic(uid,text,created_at,type) values(?,?,?,?)";
    db.query(insertFlowComment_sql,[uid,text,created_at,type],(err,insertRst) => {
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
      // 回复成功
      // 获取topic_id
      let curTopic_sql = `select AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='xiyouquan' and TABLE_NAME = 'topic'`;
      db.query(curTopic_sql,(err,next_cid) => {
        if (err) {
          console.log(err);
          return
        }
        let topic_id = next_cid[0].AUTO_INCREMENT-1;
        // 返回topic_id
        res.json({
          "ok":1,
          "data":{
            "topic_id":topic_id
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