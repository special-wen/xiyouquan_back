var express = require('express');
var router = express.Router();
const db = require('../mysql');
const nodejieba = require('nodejieba');


router.post('/edit', function(req, res, next) {
  // 判断用户是否已经登陆
  if (req.session.userInfo && req.session.userInfo) {
    let text = req.body.text;
    let created_at = req.body.created_at;
    let type = req.body.type;
    let uid = req.session.userInfo.uid;
    let pics = req.body.pics;
    
    // 插入topic信息 
    let insertFlowComment_sql = "insert into topic(uid,text,created_at,type,pics) values(?,?,?,?,?)";
    db.query(insertFlowComment_sql,[uid,text,created_at,type,pics],(err,insertRst) => {
      if (err) {
        console.log(err);
        res.json({
          "ok":0,
          "data":{
            "msg":"回复失败"
          }
        })
        return;
      }
      // 回复成功
      // 获取topic_id
      let curTopic_sql = `select AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='xiyouquan' and TABLE_NAME = 'topic'`;
      db.query(curTopic_sql,(err,next_cid) => {
        if (err) {
          console.log(err);
          return
        }
        let topic_id = next_cid[0].AUTO_INCREMENT-1;
        
        // 根据topic创建tmodel
        if (text !== null) {
          const tag = nodejieba.extract(text,3);
          let key_words = '';
          tag.map(item => {
            key_words += item.word+',';
            // key_words.push(item.word);
          })
          // this.pics_url = this.pics_url.substring(0, this.pics_url.length - 1);
          key_words = key_words.substring(0,key_words.length-1);
          let tmodel_sql = 'insert into tmodel(topic_id,key_words) values (?,?)'
          db.query(tmodel_sql,[topic_id,key_words],(err,rst) => {
            if (err) {
              console.log(err);
              return;
            }
          })

          // 获取所有的tmodel所有的topic_id 对应的model,并将现在的model字段与其对比，成功就插入
          let allTmodel_sql = 'select * from tmodel where topic_id != ?';
          let cur_key_words = key_words.split(',');
          db.query(allTmodel_sql,topic_id,(err,simmile_card) => {
            // 如果没有数据，则什么都不作
            if (simmile_card.length !== 0) {
              simmile_card.map(all_key_card => {
                let mate_key_words = all_key_card.key_words.split(',');
                let count = 0;
                cur_key_words.map(item => {
                  if (mate_key_words.indexOf(item) !== -1) {
                    count++;
                  }
                })
                if (count > 1) {
                  var t1_id,t2_id;
                  if (topic_id < all_key_card.topic_id) {
                    t1_id = topic_id;
                    t2_id = all_key_card.topic_id;
                  } else {
                    t1_id = all_key_card.topic_id;
                    t2_id = topic_id;
                  }
                  // 将相似的插入simmiler表中
                  // insert into topic(uid,text,created_at,type,pics) values(?,?,?,?,?)
                  // 查找之前是否已经插入过了，如果已经插入过了，就不会插入
                  let simmileId_sql = 'select * from simmiler where t1_id = ? and t2_id = ?';
                  db.query(simmileId_sql,[t1_id,t2_id],(err,id_rst) => {
                    if (err) {
                      console.log(err);
                      return;
                    }
                    if (id_rst.length === 0) {
                      let insertSimmiler_sql = 'insert into simmiler(t1_id,t2_id) values(?,?)';
                      db.query(insertSimmiler_sql,[t1_id,t2_id],(err,insert_rst) => {
                        if (err) {
                        console.log(err);
                        return;
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
        // 返回topic_id
        res.json({
          "ok":1,
          "data":{
            "topic_id":topic_id
          }
        })
      })
    })
  } else {
    res.json({
      "ok":0,
      "data":{
        "login":false,
        "msg":"请先登陆再进行回复"
      }
    })
  }

});
module.exports = router;