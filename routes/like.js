var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.get('/like',function(req,res,next) {
  let topic_id =req.query.topic_id;
  const cur_page = req.query.page;
  let limit_page = (cur_page-1)*10;

  //查找like的数据
  let like_sql = "select * from `like` where topic_id=? order by created_at desc limit ?,?";
  db.query(like_sql,[topic_id,limit_page,10],(err,like_list) => {
    if (err) {
      console.log(err);
      return;
    }
    let arr = [];
    if (like_list.length < 10) {
      count = 0;
    } else {
      count = 10;
    }
    like_list.map((like) => {
      let likeList = {
        "created_at":like.created_at,
        "uid":like.uid,
        "topic_id":like.topic_id
      }
      // 根据uid查找user信息
      let userInfo_sql = 'select * from user where uid = ?';
      db.query(userInfo_sql,like.uid,(err,user_info) => {
        if (err) {
          console.log(err);
          return;
        }
        likeList.screen_name = user_info[0].screen_name;
        likeList.user_header_img = user_info[0].user_header_img;
        arr.push(likeList);
        if (arr.length === like_list.length) {
          // console.log(arr);
          res.json({
            "ok":1,
            "data":{
              "data":arr
            },
            "count":count
          })
        }
      })
    })
  })
})
module.exports = router;