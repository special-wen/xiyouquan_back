var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.get('/topicDetails',function(req,res,next) {
  let topic_id = req.query.topic_id;

  // 查找topic话题的具体信息
  let topicDetail_sql = 'select * from topic where topic_id=?';
  db.query(topicDetail_sql,topic_id,(err,topic_card) => {
    if (err) {
      // 查询失败
      console.log(err);
      return;
    }
    let pics;
    if (topic_card[0].pics !== null) {
      pics = topic_card[0].pics.split(",")
    } else {
      pics = topic_card[0].pics
    }
    let topic_details = {};
    let hot_topic = {
      "topic_id":topic_card[0].topic_id,
      "edit_at":topic_card[0].created_at,
      "text":topic_card[0].text,
      "pics":pics,
      "card_type":topic_card[0].type
    }

    //查找该topic的评论总数
    let commentCount_sql = 'select count(1) from comment where topic_id=?'
    db.query(commentCount_sql,topic_id,(err,comment_counts) => {
      if (err) {
        console.log(err);
        return;
      }
      hot_topic.comment_count = comment_counts[0]["count(1)"];
    })

    // 查找like总数
    let likeCount_sql = 'select count(1) from `like` where topic_id=?'
    db.query(likeCount_sql,topic_id,(err,like_counts) => {
      if (err) {
        console.log(err);
        return;
      }
      hot_topic.like_count = like_counts[0]["count(1)"];
    })
    topic_details.hot_topic = hot_topic;
    // 查找topic对应的user信息
    let uid = topic_card[0].uid;
    let userInfo_sql = 'select * from user where uid = ?';
    db.query(userInfo_sql,uid,(err,userInfo) => {
      if (err) {
        console.log(err)
        return
      }
      let user_info = {
        "uid":userInfo[0].uid,
        "user_header_img":userInfo[0].user_header_img,
        "screen_name":userInfo[0].screen_name
      }
      topic_details.user_info = user_info
      res.json({
        "ok":1,
        "data":{
          "topic_details":topic_details
        }
      })
    })
  })
})
module.exports = router;