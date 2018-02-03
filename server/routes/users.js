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

//查询当前用户的购物车列表数据
router.get("/cartList", function(req, res, next) {
  let userId = req.cookies.userId;  //获取用户ID
  User.findOne({userId: userId}, function(err, doc){
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: null
      })
    } else {
      if(doc) {
        res.json({
          status: 0,
          msg: '',
          result: doc.cartList
        });
      }
    }
  });
});

//购物车删除功能
router.post("/cartDel",function(req, res, next) {
  let userId = req.cookies.userId, productId = req.body.productId;
  User.update({
    userId: userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  }, function(err, doc) {
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: null
      });
    } else {
      res.json({
        status: 0,
        msg: '',
        result: 'success'
      });
    }
  });
});
//修改商品数量
router.post("/cartEdit", function(req, res, next) {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({"userId": userId,"cartList.productId":productId},{
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked
  }, function(err,doc) {
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: 0,
        msg: '',
        result: 'success'
      });
    }
  })
});

//购物车的修改
router.post("/editCheckAll", function(req, res, next) {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId: userId}, function(err, user) {
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      });
    } else {
      if(user) {
        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        });
        user.save(function(err1,doc1){
          if(err1) {
            res.json({
              status: 1,
              msg: err1.message,
              result: ''
            })
          } else {
            res.json({
              status: 0,
              msg: '',
              result: 'success'
            });
          }
        })
      }

    }
  })
});
module.exports = router;
