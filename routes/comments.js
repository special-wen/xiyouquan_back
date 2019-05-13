var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.get('/comments',function(req,res,next) {
  let topic_id = req.query.topic_id;
  const cur_page = req.query.page;
  let limit_page = (cur_page-1)*10;

  // 查找该topic的评论
  let comment_sql = "select * from comment where topic_id=? order by created_at desc limit ?,? ";
  db.query(comment_sql,[topic_id,limit_page,10],(err,comment_list) => {
    // 查找评论失败
    if (err) {
      console.log(err);
      return;
    }
    // 成功
    let arr = [];
    if (comment_list.length<10) {
      count = 0;
    } else {
      count = 10;
    }
    
    comment_list.map((comment) => {
      let comments = {
        "created_at":comment.created_at,
        "cid":comment.cid,
        "rootid":comment.root_id,
        "text":comment.text,
      }
      //查找二级评论comment
      let flowComment_sql = "select c.topic_id,c.cid,c.uid,c.root_id,c.text,c.created_at,p.uid,p.screen_name from comment as c,user as p where root_id = ? and c.uid = p.uid order by created_at desc limit 0,2"
      db.query(flowComment_sql,comment.cid,(err,comment_flow) => {
        if (err) {
          console.log("查找子评论失败",err);
          return;
        }
        if (comment_flow.length > 0) {
          comments.flow_comment_info = comment_flow;
        }
      })
      // 查找子评论的总共条数
      let flowCommentsCount_sql = 'select count(1) from comment where root_id=? and topic_id = 0';
      db.query(flowCommentsCount_sql,comment.cid,(err,flow_count) => {
        if (err) {
          console.log(err)
          return;
        }
        comments.flow_count = flow_count[0]["count(1)"];
      })
      // 查找父级评论的信息user信息
      let userInfo_sql = 'select * from user where uid=?';
      db.query(userInfo_sql,comment.uid,(err,user_info) => {
        if (err) {
          console.log(err)
          return;
        }
        user_info.map(user => {
          let user_infos = {
            "uid":user.uid,
            "user_screen_name":user.screen_name,
            "user_header_img":user.user_header_img
          }
          comment.user_info = user_infos;
          comment.comment = comments;
          comment.topic_id = undefined;
          comment.cid = undefined;
          comment.root_id = undefined;
          comment.text = undefined;
          comment.uid = undefined;
          comment.created_at = undefined;
          arr.push(comment);
          if (arr.length === comment_list.length) {
            res.json({
              "ok":1,
              "data":{
                "comment_info":arr
              },
              count:count
            })
          }
        })
      })
    })
  })
  
})
module.exports = router;