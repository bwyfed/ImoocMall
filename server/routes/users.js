var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//用户登录逻辑处理
router.post("/login", function(req, res, next) {
  let param = {
    userName: req.body["userName"],
    userPwd: req.body.userPwd
  };
  User.findOne(param,function(err, doc){
    if(err) {
      res.json({
        status: 1,
        msg: "账号密码不对"
      });
    } else {
      if(doc) {
        //登录成功，往cookie里写入userId
        res.cookie("userId",doc.userId,{
          path: '/',
          maxAge: 1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path: '/',
          maxAge: 1000*60*60
        });
        // req.session.user = doc; //存在session中
        res.json({
          status: 0,
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  });

});

//登出接口
router.post("/logout", function(req,res,next) {
  //登出时，需要将cookie里的userId删除或者置为空
  res.cookie("userId","",{
    path: "/",
    maxAge: -1
  });
  res.json({
    status: 0,
    msg: '',
    result:null
  });
});

router.get("/checkLogin", function(req, res, next){
  if(req.cookies.userId) {
    res.json({
      status: 0,
      msg: '',
      result: req.cookies.userName
    });
  } else {
    res.json({
      status: 1,
      msg: '未登录',
      result: null
    })
  }
});

module.exports = router;
