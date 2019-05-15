var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.get('/hotFlowChild',(req,res) => {
  let root_id = req.query.root_id;
  const cur_page = req.query.page;
  let limit_page = (cur_page-1)*10;
	let hotflowChild_sql = 'select * from comment where root_id = ? order by created_at desc limit ?,?';
	db.query(hotflowChild_sql,[root_id,limit_page,10],(err,hotflowChild) => {
		if (err) {
			console.log(err);
			return;
    }
    let arr = [];
    if (hotflowChild.length < 10) {
      count = 0;
    } else {
      count = 10;
    }
    if (hotflowChild.length === 0) {
      res.json({
        "ok":1,
        "data":{
          "childHotFlow":hotflowChild
        },
        "count":count
      })
    } else {
      hotflowChild.map(item => {
        let hotflow_info = {
          "uid":item.uid,
          "text":item.text,
          "cid":item.cid,
          "created_at":item.created_at
        };
      // 根据uid获取用户信息
      let userInfo_sql = 'select * from user where uid = ?';
      db.query(userInfo_sql,item.uid,(err,user_info) => {
        if (err) {
          console.log(err);
          return;
        }
        hotflow_info.screen_name = user_info[0].screen_name;
        hotflow_info.user_header_img = user_info[0].user_header_img;
        arr.push(hotflow_info);
        if (arr.length === hotflowChild.length) {
          res.json({
            "ok":1,
            "data":{
              "childHotFlow":arr
            },
            "count":count
          })
        }
      })
      })
    }
    
	})
})
module.exports = router;