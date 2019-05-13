var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.get('/topic', function(req, res, next) {
  const uid = req.query.uid;
  const cur_page = req.query.page;
  let limit_page = (cur_page-1)*10;
  // 获取uid的topic信息
  let topic_sql = 'select t.topic_id,t.text,t.uid,t.created_at,t.pics,p.screen_name,p.uid,p.user_header_img from topic as t,user as p where p.uid = ? and t.uid = p.uid order by created_at desc limit ?,?'
  db.query(topic_sql,[uid,limit_page,10],(err,topic_cards) => {
    if (err) {
      console.log("查询失败");
      return;
    }
    let arr = [];
    // let count;
    if (topic_cards.length < 10) {
      counts = 0;
    } else {
      counts = 10;
    }    
    topic_cards.map(item => {
      //更改图片格式
      if (item.pics !== null) {
        let pics = item.pics.split(",");
        item.pics = pics;      
      } else {
        item.pics = item.pics;
      }
      //查找 topic_id对应的like和comment的总数
      let commentCount_sql = 'select count(1) from comment where topic_id=?';
      db.query(commentCount_sql,item.topic_id,(err,count) => {
        item.comment_count = count[0]["count(1)"];
        let likeCount_sql = 'select count(1) from `like` where topic_id=?';
        db.query(likeCount_sql,item.topic_id,(err,count) => {
          item.like_count = count[0]["count(1)"];
          //获取当前用户是否点赞了
          //先判断session
          if (req.session.userInfo) {
            let cur_id = req.session.userInfo.uid;
            let likeCur_sql = 'select * from `like` where uid =? and topic_id =?'
            db.query(likeCur_sql,[cur_id,item.topic_id],(err,flag) => {
              if (err) {
                console.log(err);
                return;
              }
              if (flag.length === 0) {
                item.like = false;
              } else {
                item.like = true;
              }
              arr.push(item);
              if (arr.length === topic_cards.length) {
                console.log(arr);
                res.json({
                  "ok":1,
                  "data":arr,
                  "count":counts
                })
              }
            })
          } else {
            arr.push(item);
            if (arr.length === topic_cards.length) {
              console.log(arr);
              res.json({
                "ok":1,
                "data":arr,
                "count":counts
              })
            }
          }
        })
      })
    })
  })
});



module.exports = router;