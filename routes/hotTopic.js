var express = require('express');
var router = express.Router();
const db = require('../mysql');
const nodejieba = require('nodejieba');

router.get('/hotTopic', function(req, res, next) {
  const cur_page = req.query.page;
  let limit_page = (cur_page-1)*10;
  
  // 获取数据库中话题的总数

  //如果用户已经登陆了，就推荐算法: 找出用户的点赞的topic_id并为其推荐，
  // 如果没有找到能为其推荐的，或者用户还没有点赞，就取数据库中的所以话题，排序为最新创建的为序
  if (req.session.userInfo) {
    console.log("用户已经登陆");
    let uid = req.session.userInfo.uid;
    let like_topicId_sql = 'select * from `like` where uid = ?'
    db.query(like_topicId_sql,uid,(err,like_topic_id) => {
      // 如果有like_id,在simmiler数据库中查找所有相似的数据，为用户推荐
      if (err) {
        console.log(err)
        return;
      }
      if (like_topic_id.length !== 0) {
        let simmilerId_sql = 'select * from simmiler where t1_id = ? or t2_id = ?';
        // db.query(simmilerId_sql,[like_topic_id.topi])
        var simmiler_id = [];
        let map_count = 0;
        let like_id = [];
        like_topic_id.map(id => {
          like_id.push(id.topic_id);
        })
        like_topic_id.map(item => {
          db.query(simmilerId_sql,[item.topic_id,item.topic_id],(err,rst_id) => {
            if (err) {
              console.log(err);
              return;
            }
            map_count++;            
            if (rst_id.length > 0 ) {
              rst_id.map(item_id => {
                if (item_id.t1_id === item.topic_id) {
                  if (like_id.indexOf(item_id.t2_id) === -1)
                    simmiler_id.push(item_id.t2_id);
                } else {
                  if (like_id.indexOf(item_id.t1_id) === -1)
                    simmiler_id.push(item_id.t1_id);
                }
              })
            }
            if (map_count === like_topic_id.length) {
              // console.log(simmiler_id);
              // console.log(simmiler_id,like_topic_id.topic_id);
              // 根据simmiler_id中的id再区查找数据
              let newArr = [];
              for (let i in simmiler_id) {
                newArr[i] = {"topic_id":simmiler_id[i]}
              }
              let arr = [];
              let topic_sql = 'select * from topic where topic_id=?';
              newArr.map((item) => {
          
                // 获取话题的信息
                db.query(topic_sql,item.topic_id,(err,rst_hotTopic) => {
                  rst_hotTopic.map(card => {
                    if (card.pics !== null) {
                      let pics = card.pics.split(",");
                      let hot_topic = {
                        "topic_id":card.topic_id,
                        "edit_at":card.created_at,
                        "text":card.text,
                        "pics":pics,
                      };
                      item.hot_topic = hot_topic;
                    } else {
                      let hot_topic = {
                        "topic_id":card.topic_id,
                        "edit_at":card.created_at,
                        "text":card.text,
                        "pics":card.pics,
                      };
                      item.hot_topic = hot_topic;
                  }
                   // 获取话题中评论信息，仅获取评论条数
                  let commentCount_sql = 'select count(1) from comment where topic_id=?'
                  db.query(commentCount_sql,item.topic_id,(err,comment_counts) => {
                    if (err) {
                      console.log(err);
                      return;
                    }
                    item.hot_topic.comment_count = comment_counts[0]["count(1)"];
                  })
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
                  if (arr.length === newArr.length) {
                    res.json({
                      "ok":1,
                      "data":{
                        "card":arr,
                        "count":0
                      }
                    })
                  } 
                })                                                                             
              })
            })
          })
            }
          })
        })
      } else {
        // 如果没有，就冲数据库中寻找最新的话题渲染
        let hot_sql = 'select * from ( ' 
      +'select * from topic order by created_at limit ?,?) ' 
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
                };
                item.hot_topic = hot_topic;
              } else {
                let hot_topic = {
                  "topic_id":card.topic_id,
                  "edit_at":card.created_at,
                  "text":card.text,
                  "pics":card.pics,
                };
                item.hot_topic = hot_topic;
              }
              // 获取话题中评论信息，仅获取评论条数
              let commentCount_sql = 'select count(1) from comment where topic_id=?'
              db.query(commentCount_sql,item.topic_id,(err,comment_counts) => {
                if (err) {
                  console.log(err);
                  return;
                }
                item.hot_topic.comment_count = comment_counts[0]["count(1)"];
              })
              
              // 获取话题中的点赞信息
              let likeCount_sql = 'select count(1) from `like` where topic_id=?'
              db.query(likeCount_sql,item.topic_id,(err,like_counts) => {
                if (err) {
                  console.log(err);
                  return;
                }
                item.hot_topic.like_count = like_counts[0]["count(1)"];
              })
              
              //  获取数量以及当前用户是否点赞
              let likeCur_sql = 'select * from `like` where uid =? and topic_id =?'
              db.query(likeCur_sql,[uid,item.topic_id],(err,like_cur) => {
                if (err) {
                  console.log(err);
                  return;
                }
                if (like_cur.length === 0) {
                  item.hot_topic.like = false;
                } else {
                  item.hot_topic.like = true;
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
      }
    })
  } else {
    console.log("用户没有登陆");
    // 如果用户没有登陆，就以点赞量排序，从大到小，提供翻页功能，一页10条
    let likeCount_sql = 'select topic_id, sum(isLike) as like_count '
    +'from `like` '
    +'group by topic_id '
    +'order by sum(isLike) desc '
    +'limit ?,?';
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
            rst_hotTopic.map(card => {
              if (card.pics !== null) {
                let pics = card.pics.split(",");
                let hot_topic = {
                  "topic_id":card.topic_id,
                  "edit_at":card.created_at,
                  "text":card.text,
                  "pics":pics,
                };
                item.hot_topic = hot_topic;
              } else {
                let hot_topic = {
                  "topic_id":card.topic_id,
                  "edit_at":card.created_at,
                  "text":card.text,
                  "pics":card.pics,
                };
                item.hot_topic = hot_topic;
              }

              // 获取话题中评论信息，仅获取评论条数

              let commentCount_sql = 'select count(1) from comment where topic_id=?'
              db.query(commentCount_sql,item.topic_id,(err,comment_counts) => {
                if (err) {
                  console.log(err);
                  return;
                }
                item.hot_topic.comment_count = comment_counts[0]["count(1)"];
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