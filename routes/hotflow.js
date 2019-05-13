var express = require('express');
var router = express.Router();
const db = require('../mysql');

router.get('/hotflow',(req,res) => {
	let topic_id = req.query.topic_id;
	let cid = req.query.c_id;
	let hotflow_sql = 'select * from comment where topic_id = ? and cid = ?';
	db.query(hotflow_sql,[topic_id,cid],(err,hotflow) => {
		if (err) {
			console.log(err);
			return;
		}
		let hotflow_info = {
			"uid":hotflow[0].uid,
			"text":hotflow[0].text,
			"topic_id":hotflow[0].topic_id,
			"cid":hotflow[0].cid,
			"created_at":hotflow[0].created_at
		};
		// 根据uid获取用户信息
		let userInfo_sql = 'select * from user where uid = ?';
		console.log(hotflow[0].uid)
    db.query(userInfo_sql,hotflow[0].uid,(err,user_info) => {
			if (err) {
				console.log(err);
				return;
			}
			hotflow_info.screen_name = user_info[0].screen_name;
			hotflow_info.user_header_img = user_info[0].user_header_img;
			res.json({
				"ok":1,
				"data":{
					"hotflow":hotflow_info
				}
			})
		})
	})
})
module.exports = router;