var express = require('express');
var router = express.Router();
var async = require('async');
const db = require('../mysql');

router.get('/hotTopic', function(req, res, next) {
  const cur_page = req.query.page;
  let limit_page = (cur_page-1)*10;
  var topic_cards = [];
  let json_card = [];
  //如果用户已经登陆了，就推荐算法 目前先取数据库中的所有数据返回页面
  if (req.session.userInfo && req.session.userInfo) {
    let hot_sql = 'select * from topic limit ?,?';
    db.query(hot_sql,[limit_page,10],(err,res) => {
      if (err) {
        console.log("查询失败")
      } else {
        console.log(res,'====');
      }
    })
  } else {
    // 如果用户没有登陆，就以点赞量排序，从大到小，提供翻页功能，一页10条
    let likeCount_sql = 'select topic_id, sum(isLike) as like_count '
    +'from `like` '
    +'group by topic_id '
    +'order by sum(isLike) desc '
    +'limit ?,?';
    db.query(likeCount_sql,[limit_page,10],(err,res) => {
      if (err) {
        console.log("查询失败",err)
      } else {
        let topic_id = [];
        let like_counts = [];
        let arr = [];
        res.map(item => {
          topic_id.push(item.topic_id);
          like_counts.push(item.like_count);
        });
        async.map(topic_id,function(v,callback){
          let topic_sql = 'select * from topic where topic_id=?';
          db.query(topic_sql,v,function(err,res){
            if (err) {
              console.log("查询失败"+err);
            } else {
              arr.push(res[0]);
              callback(null,arr);
            }
          });
        },function(err,results) {
          if (err) {
            console.log("失败"+err);
            return;
          } else {
            for (let i in arr) {
              arr[i].like_count = like_counts[i];
            }
          }
        })
        setTimeout(()=> {
          topic_cards = arr;
        },1000);
      }
    })
  };
});



module.exports = router;