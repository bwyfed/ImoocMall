/**
 * Created by Hello on 2017/10/14.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');
//监听数据库连接成功方法
mongoose.connection.on("connected", function(){
  console.log('MongoDB connected success.')
});

mongoose.connection.on("error", function(){
  console.log('MongoDB connected fail.')
});

mongoose.connection.on("disconnected", function(){
  console.log('MongoDB connected disconnected.')
});
//查询商品列表信息
router.get("/",function(req,res,next){
  let params = {};
  let page = parseInt(req.query["page"]||1);//获取当前页面号码，默认为1
  let pageSize = parseInt(req.query["pageSize"]||0); //每页的条目数，默认为0时，limit(0)会返回所有
  let priceLevel = req.query['priceLevel']||'all';  //价格过滤参数，字符串'0','1','2','3'或者'all'，默认是'all'
  let sort = req.query["sort"]||1; //排序是升序还是降序，默认是升序
  let skip = (page-1)*pageSize; //跳过的条数
  let priceGt = '',priceLte = ''; //价格的最大区间和最小区间
  if(priceLevel!=='all') {
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100;break;
      case '1': priceGt = 100; priceLte = 500;break;
      case '2': priceGt = 500; priceLte = 1000;break;
      case '3': priceGt = 1000; priceLte = 5000;break;
    }
    //条件查询
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    };
  }
  //分页功能:查找所有的数据，跳过skip条数据，并限制每页是pageSize条数据
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  //排序功能
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function(err,doc){
    if(err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  });
  // res.send("hello, goods list.");
  //查询数据库
  /*
  Goods.find({},function(err,doc) {
    if(err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  });
  */
});
//加入商品到某个用户的购物车
router.post("/addCart",function(req,res,next){
  //这里假设用户已经登录了
  var userId = '100000077',productId = req.body.productId;
  var User = require('../models/user'); //获取模型，执行API

  User.findOne({userId: userId},function(err,userDoc) {
    if(err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {//已经获取到用户的信息
      console.log("userDoc:"+userDoc);
      if(userDoc) {
        let goodsItem;
        //遍历所有的用户信息
        userDoc.cartList.forEach(function(item){
          if(item.productId == productId) {
            goodsItem = item;
            item.productNum ++;
          }
        });
        if(goodsItem) {
          //购物车已经有了，再保存一次即可
          userDoc.save(function(err2,doc2){
            if(err2) {
              res.json({
                status: 1,
                msg: err.message
              })
            } else {
              res.json({
                status: 0,
                msg: '',
                result: 'save success'
              })
            }
          })
        } else {
          //购物车中没有此商品，那么添加商品到购物车中
          //在商品列表中查询该商品是否存在
          Goods.findOne({productId: productId},function(err1,doc1) {
            if(err1) {
              res.json({
                status: 1,
                msg: err.message
              })
            } else {
              if(doc1) { //获得了该条商品的信息
                doc1.productNum = 1;
                doc1.checked = 1;
                //将商品信息(文档)加入到用户信息(购物车)里面去
                userDoc.cartList.push(doc1);
                userDoc.save(function(err2,doc2){
                  if(err2) {
                    res.json({
                      status: 1,
                      msg: err.message
                    })
                  } else {
                    res.json({
                      status: 0,
                      msg: '',
                      result: 'save success'
                    })
                  }
                })
              }
            }
          })
        }
      }
      else {
        res.json({
          status: 1,
          msg: '用户信息不存在'
        })
      }
    }
  });
});
module.exports = router;
