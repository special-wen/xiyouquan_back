var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.get('/pageInfo', function(req, res, next) {
  let uid =req.query.uid;
  let info_sql = 'select * from user where uid = ?';
  db.query(info_sql,uid,(err,user_info) => {
    if (err) {
      console.log(err);
      return;
    }
    let userInfo = {
      "screen_name":user_info[0].screen_name,
      "uid":user_info[0].uid,
      "user_header_img":user_info[0].user_header_img
    } 
    res.json({
      "ok":1,
      "data":{
        "user_info":userInfo
      }
    })
  })
});
module.exports = router;