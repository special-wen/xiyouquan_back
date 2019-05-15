var express = require('express');
var router = express.Router();
var formidable = require('formidable');
const db = require('../mysql');

router.post('/pics', function(req, res, next) {
  // console.log(req.body)
  let form = new formidable.IncomingForm();
  var targetFile = "/home/sqlness/xiyouquan_img/upload"
  form.uploadDir = targetFile;
  form.parse(req,(err,fields,files) => {
    if (err) {
      console.log(err);
      return;
    }
    let path = files.file.path;
    // path.split('/');
    let tag = path.split('/');
    let picURL = `http://127.0.0.1/img/`+tag[tag.length-1];
    res.json({
      "ok":1,
      "data":{
        "picInfo":[
          {
            "path":picURL,
          }
        ] 
      }
    })
  })  
});
module.exports = router;