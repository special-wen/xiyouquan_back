var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.get('/studyTopic', function(req, res, next) {
  const cur_page = req.query.page;
  let limit_page = (cur_page-1)*10;
  
  // 获取数据库中话题的总数

  //如果用户已经登陆了，就推荐算法 目前取数据库中的所以话题，排序为最新创建的为序
  if (req.session.userInfo) {
    console.log("用户已经登陆");
    let uid = req.session.userInfo.uid;
    // select *from ( select * from topic order by created_at limit 0,10 ) as a order by created_at desc;
    let hot_sql = 'select * from ( ' 
      +'select * from topic where type = 1 order by created_at limit ?,?) ' 
      +'as hotCard order by created_at desc';
    db.query(hot_sql,[limit_page,10],(err,result) => {
      if (err) {
        console.log("查询失败",err)
      } else {
        let arr = [];
        if (result.length<10) {
          count = 0;
        } else {
          count = 10;
        }
        result.map((item) => {
          // 获取话题的信息
          let topic_sql = 'select * from topic where topic_id=?';
          db.query(topic_sql,item.topic_id,(err,rst_hotTopic) => {
            rst_hotTopic.map(card => {
              if (card.pics !== null) {
                let pics = card.pics.split(",");
                let hot_topic = {
                  "topic_id":card.topic_id,
                  "edit_at":card.created_at,
                  "text":card.text,
                  "pics":pics,
                  "like_count":item.like_count
                };
                item.study_topic = hot_topic;
              } else {
                let hot_topic = {
                  "topic_id":card.topic_id,
                  "edit_at":card.created_at,
                  "text":card.text,
                  "pics":card.pics,
                  "like_count":item.like_count
                };
                item.study_topic = hot_topic;
              }

              // 获取话题中评论信息，仅获取评论条数
              let commentCount_sql = 'select count(1) from comment where topic_id=?'
              db.query(commentCount_sql,item.topic_id,(err,comment_counts) => {
                if (err) {
                  console.log(err);
                  return;
                }
                item.study_topic.comment_count = comment_counts[0]["count(1)"];
              })
              
              // 获取话题中的点赞信息
              let likeCount_sql = 'select count(1) from `like` where topic_id=?'
              db.query(likeCount_sql,item.topic_id,(err,like_counts) => {
                if (err) {
                  console.log(err);
                  return;
                }
                item.study_topic.like_count = like_counts[0]["count(1)"];
              })
              
              //  获取数量以及当前用户是否点赞
              let likeCur_sql = 'select * from `like` where uid =? and topic_id =?'
              db.query(likeCur_sql,[uid,item.topic_id],(err,like_cur) => {
                if (err) {
                  console.log(err);
                  return;
                }
                if (like_cur.length === 0) {
                  item.study_topic.like = false;
                } else {
                  item.study_topic.like = true;
                }
              })

              item.like_count = undefined;
              item.topic_id = undefined;
              item.created_at = undefined;
              item.delete = undefined;
              item.pics = undefined;
              item.type = undefined;
              item.uid = undefined;
              item.text = undefined;
              //获取创建话题user_info中的信息
              let userInfo_sql = 'select * from user where uid=?';
              db.query(userInfo_sql,card.uid,(err,userInfo) => {
                if (err) {
                  console.log(err);
                  return;
                }
                item.user_info={
                  "uid":userInfo[0].uid,
                  "user_header_img":userInfo[0].user_header_img,
                  "screen_name":userInfo[0].screen_name
                }
                arr.push(item);
                if (arr.length === result.length) {
                  res.json({
                    "ok":1,
                    "data":{
                      "card":arr,
                      count:count
                    }
                  })
                } 
              })
                                                                                           
            })
          })
        })
      }
    })
  } else {
    console.log("用户没有登陆");
    // 如果用户没有登陆，就以点赞量排序，从大到小，提供翻页功能，一页10条
    let likeCount_sql = 'select t.type,l.topic_id, sum(l.isLike) as like_count'+ 
    ' from `like` as l,topic as t where l.topic_id=t.topic_id and t.type = 1'+
    ' group by l.topic_id'+ 
    ' order by sum(l.isLike) desc'+ 
    ' limit ?,?';
    db.query(likeCount_sql,[limit_page,10],(err,result) => {
      if (err) {
        console.log("查询失败",err)
      } else {
        let arr = [];
        if (result.length<10) {
          count = 0;
        } else {
          count = 10;
        }
        let topic_sql = 'select * from topic where topic_id=?';
        result.map((item) => {
          // 获取话题的信息
          db.query(topic_sql,item.topic_id,(err,rst_hotTopic) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log(rst_hotTopic.length);
            rst_hotTopic.map(card => {
              if (card.pics !== null) {
                let pics = card.pics.split(",");
                let hot_topic = {
                  "topic_id":card.topic_id,
                  "edit_at":card.created_at,
                  "text":card.text,
                  "pics":pics,
                  "like_count":item.like_count
                };
                item.study_topic = hot_topic;
              } else {
                let hot_topic = {
                  "topic_id":card.topic_id,
                  "edit_at":card.created_at,
                  "text":card.text,
                  "pics":card.pics,
                  "like_count":item.like_count
                };
                item.study_topic = hot_topic;
              }
              
              // 获取话题中评论信息，仅获取评论条数

              let commentCount_sql = 'select count(1) from comment where topic_id=?'
              db.query(commentCount_sql,item.topic_id,(err,comment_counts) => {
                if (err) {
                  console.log(err);
                  return;
                }
                item.study_topic.comment_count = comment_counts[0]["count(1)"];
              })
              
              item.like_count = undefined;
              item.topic_id = undefined;
              //获取创建话题user_info中的信息
              let userInfo_sql = 'select * from user where uid=?';
              db.query(userInfo_sql,card.uid,(err,userInfo) => {
                if (err) {
                  console.log(err);
                  return;
                }
                item.user_info={
                  "uid":userInfo[0].uid,
                  "user_header_img":userInfo[0].user_header_img,
                  "screen_name":userInfo[0].screen_name
                }
                arr.push(item);
                // console.log(arr);
                if (arr.length === result.length) {
                  res.json({
                    "ok":1,
                    "data":{
                      "card":arr,
                      count:count
                    }
                  })
                } 
              })
                                                                                           
            })
          })
        })
      }
    })
  };
});
module.exports = router;