var express = require('express');
var router = express.Router();
require('../util/util');
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
//查询用户地址列表接口
router.get("/addressList",function(req, res, next){
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,doc){
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: null
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: doc.addressList
      })
    }
  });
});
//设置默认地址接口
router.post("/setDefault",function(req,res,next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  if(!addressId) {
    res.json({
      status: 1003,
      msg: 'addressId is null',
      result: null
    })
  } else {
    User.findOne({userId: userId}, function(err, doc) {
      if(err) {
        res.json({
          status: 1,
          msg: err.message,
          result: null
        });
      } else {
        var addressList = doc.addressList;
        addressList.forEach((item)=>{
          //默认地址只有一个，因此这里设置互斥的情形
          if(item.addressId === addressId) {
            item.isDefault = true;
          } else {
            item.isDefault = false;
          }
        });
        //然后保存修改后的文档
        doc.save(function(err1,doc1){
          if(err1) {
            res.json({
              status: 1,
              msg: err1.message,
              result: null
            });
          } else {
            res.json({
              status: 0,
              msg: '',
              result: null
            });
          }
        });
      }
    })
  }
});
//删除地址的接口
router.post("/delAddress",function(req, res, next) {
  var userId = req.cookies.userId,addressId = req.body.addressId;
  User.update({
    userId: userId
  },{
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  },function(err,doc){
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
        result: null
      })
    }
  })
});
//创建订单接口
router .post("/payment", function(req, res, next){
  var userId = req.cookies.userId,
    orderTotal = req.body.orderTotal, //订单总金额
    addressId = req.body.addressId;
  User.findOne({userId: userId}, function(err, doc){
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: null
      });
    } else {
      var address = '',goodsList=[];
      //获取当前用户的地址信息
      doc.addressList.forEach((item)=>{
        if(addressId===item.addressId) {
          address = item;
        }
      });
      //获取用户购物车的购买商品
      doc.cartList.filter((item)=>{
        if(item.checked==='1') {
          goodsList.push(item);
        }
      });
      //生成订单号
      var platform = '622';   //当前平台编码
      var r1 = Math.floor(Math.random()*10);
      var r2 = Math.floor(Math.random()*10);

      var sysDate = new Date().Format('yyyyMMddhhmmss');  //系统时间
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');  //订单创建时间
      var orderId = platform+r1+sysDate+r2; //订单ID 21位

      //创建订单
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: 1, //订单状态
        createDate: createDate  //订单创建日期
      };
      doc.orderList.push(order);
      doc.save(function(err1,doc1){
        if(err1) {
          res.json({
            status: 1,
            msg: err1.message,
            result: null
          });
        } else {
          res.json({  //用于给用户返回的数据
            status: 0,
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
        }
      });

    }
  })
});
module.exports = router;
