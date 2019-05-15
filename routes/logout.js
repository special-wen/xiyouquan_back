var express = require('express');
var router = express.Router();

router.post('/logout', function(req, res, next) {
  console.log('=--')
  if (req.session.userInfo ) {
    console.log('aa')
    req.session.destroy();
    // req.session.userInfo.destory();
    //已经登陆过了
    // console.log("session中有信息了")
    res.json({
      "ok":1,
      
    })
  }
});
module.exports = router;