var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.get('/createComment',function(req,res,next) {
  // 后端判断用户是否已经登陆
  // 若登陆，查找cid插入comment
  if (req.session.userInfo && req.session.userInfo) {
    let uid = req.session.userInfo.uid;
    let topic_id = parseInt(req.query.topic_id);
    let text = req.query.text;
    let created_at = parseInt(req.query.created_at);
  // 获取当前comment的c_id
    let cidCur_sql = `select AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='xiyouquan' and TABLE_NAME = 'comment'`;
    db.query(cidCur_sql,(err,cid_cur)=> {
      if (err) {
        console.log('查找cid失败');
        return;
      }
      let cid = cid_cur[0].AUTO_INCREMENT;
      // 根据当前的cid,root_id插入评论
      let insterComment_sql = "insert into comment(topic_id,cid,uid,root_id,text,created_at) values(?,?,?,?,?,?)";
      db.query(insterComment_sql,[topic_id,cid,uid,0,text,created_at],(err,comment_list) => {
      // 查找评论失败
      if (err) {
        console.log(created_at);
        console.log(err);
        return;
      }
      // 成功
      res.json({
        "ok":1,
        "data":{
          "comment_info":{
            "comment":{
              "created_at":created_at,
              "cid":cid,
              "rootid":cid,
              "text":text,
            },
            "user_info":{
              "uid":uid,
              "user_screen_name":req.session.userInfo.screen_name,
              "user_header_img":req.session.userInfo.user_header_img
            }
          }
        }
      })
  })
    })
  } else {
    // 若没有登陆，提示用户
    res.json({
      "ok":0,
      "data":{
        "msg":"请先登陆才可以评论～"
      }
    })
  }


  


  // 插入评论
  // let insterComment_sql = "inster into comment(topic_id,cid,uid,root_id,text,created_at) values(?,?,?,?,?)";
  
  
})
module.exports = router;