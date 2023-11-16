const { log } = require('console');
var express = require('express');
var router = express.Router();
const fs = require('fs');

// 引入七牛云nodejsSDK生成token信息传给前端
var qiniu = require("qiniu");
var accessKey = 'h6BkfhZ-X2xcGqz-qcy7J5FFoo5zuHr8me1e_Nw1';
var secretKey = 'gzwDa0e4EgwUPVx3FzuvF05mw-kQJv8V6T9WUiBD';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

/* GET home page. */
// 根据marker信息以及请求路径获取相应的视频链接
router.get('/total', function(req, res, next) {
  // 获取本地marker信息
  console.log(req.query.type);
  let type = req.query.type
  let jsonData = fs.readFileSync('./public/marker.json','utf-8');
  // 解析json数据
  const data = JSON.parse(jsonData);
  let marker;
  let path = ''
  if(type == 'total' ){
    marker = data.marker
  }else if(type == 'music'){
    marker = data.marker2
    path = type
  }else if(type == 'hot'){
    marker = data.marker1
    path = type
  }
  getLink(res,path,marker,5)
  
});

router.get('/home',function(req,res){
  getLink(res,'music',null,20)
})
 // 封装获取指定前缀视频路径的方法
const getLink = (res,path,marker,num) =>{
  const vedioArr = [];
  var config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z1;
  var bucketManager = new qiniu.rs.BucketManager(mac, config);
  var bucket = 'zheng-jiu-zhe';
  var options = {
    limit: num,
    prefix: path,
    marker: marker
  };
  bucketManager.listPrefix(bucket, options, function(err, respBody, respInfo) {
    if (err) {
      console.log(err);
      throw err;
    }
    if (respInfo.statusCode == 200) {
      var nextMarker = respBody.marker;
      var commonPrefixes = respBody.commonPrefixes;
      let jsonData = fs.readFileSync('./public/marker.json','utf-8');
      const data = JSON.parse(jsonData);
      if(options.prefix == ''){
        data.marker = nextMarker || ''
      }else if(options.prefix == 'hot'){
        data.marker1 = nextMarker || ''
      }else if(options.prefix == 'music'){
        data.marker2 = nextMarker || ''
      }
      fs.writeFileSync('./public/marker.json', JSON.stringify(data));
      var items = respBody.items;
      items.forEach(function(item) {
        // console.log(item.key);
        var key = item.key
        const length = path.length ? path.length+1 : 6
        if(key.length>length){
          // console.log(key.length);
          var privateBucketDomain = 'http://s30eih4r2.hb-bkt.clouddn.com';
          var deadline = parseInt(Date.now() / 1000) + 3600; // 1小时过期
          var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
          vedioArr.push(privateDownloadUrl)
        }
        
      });
    } else {
      console.log(respInfo.statusCode);
      console.log(respBody);
    }

    res.send({vedioArr:vedioArr})
    
  });


}



module.exports = router;
