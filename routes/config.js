var express = require('express');
var router = express.Router();

router.get('/config', function(req, res, next) {
  if (req.session.userInfo && req.session.userInfo) {
    //已经登陆过了
    console.log("session中有信息了")
    res.json({
      "ok":1,
      "data":{
        "login":true,
        "user_info":req.session.userInfo
      }
    })
  }else {
    console.log("session中没有信息")
    res.json({
      "ok":0,
      "data":{
        "login":false
      }
    })
  }
});
module.exports = router;