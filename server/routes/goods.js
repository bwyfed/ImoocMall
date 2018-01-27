/**
 * Created by Hello on 2017/10/14.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods'); //加载模型

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
router.get("/list",function(req,res,next){
  // res.send("hello, goods list.");
  //通过模型Goods查询数据库中的商品列表
  /*
  Goods.find({},function(err,doc) {
    if(err) {
      res.json({  //输出一个json对象
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: {
          count: doc.length,
          list: doc //doc就是查出来的文档集合
        }
      })
    }
  });
  */
  /*
  //排序功能和分页功能
  let page = parseInt(req.param("page")); //从参数获取当前是第几页
  let pageSize = parseInt(req.param("pageSize")); //每页的条目数
  let sort = req.param("sort"); //从参数中获取排序参数是升序还是降序
  let skip = (page-1)*pageSize; //跳过的条数
  let params = {};    //查询条件
  //分页功能:查找所有的数据，跳过skip条数据，并限制每页是pageSize条数据
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);  //find返回一个模型
  goodsModel.sort({'salePrice': sort});    //调用模型的sort方法，传入sort参数，对salePrice进行排序
  goodsModel.exec({},function(err,doc){
    if(err) {
      res.json({  //输出一个json对象
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: {
          count: doc.length,
          list: doc //doc就是查出来的文档集合
        }
      })
    }
  })
  */
  //加入价格过滤功能
  let page = parseInt(req.query["page"]);//获取当前页面号码
  let pageSize = parseInt(req.query["pageSize"]); //每页的条目数
  let priceLevel = req.query['priceLevel'];  //用于价格过滤
  let sort = req.query["sort"]; //排序是升序还是降序
  let skip = (page-1)*pageSize; //跳过的条数
  let priceGt,priceLte; //价格的最大区间和最小区间
  let params = {};
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
    }
  }
  //分页功能:查找所有的数据，跳过skip条数据，并限制每页是pageSize条数据
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  //排序功能，对价格进行排序
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function(err,doc){
    if(err) {
      res.json({
        status: 1,
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
});
//加入商品到购物车中
router.post("/addCart",function(req,res,next) {
  let userId = '100000077',    //假设用户已经登录了，获取了用户ID
    productId = req.body["productId"];  //商品ID
  let User = require('../models/user'); //获取用户的模型，通过模型执行其API

  //首先拿到用户的信息，才能往里插入数据，这里只拿一个用户
  User.findOne({userId:userId},function(err,userDoc){
    if(err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      console.log('userDoc');console.log(userDoc);
      if(userDoc) {
        //查看当前用户的购物车列表中有无此商品，若有就对商品数目加1
        let goodsItem = '';
        userDoc.cartList.forEach(function(item){
          if(item.productId === productId) {
            goodsItem = item;
            item.productNum++;
          }
        });
        if(goodsItem) {
          //购物车里已经有了，就直接保存到购物车中
          userDoc.save(function(err2, userDoc2){
            console.log('userDoc2');console.log(userDoc2);
            if(err2) {
              res.json({
                status: 1,
                msg: err2.message
              });
            } else {
              res.json({
                status: 0,
                msg: '',
                result: 'success'
              });
            }
          });
        } else {
          //看商品中有无此商品，查询商品信息
          Goods.findOne({productId: productId},function(err1, goodsDoc){
            if(err1) {
              res.json({
                status: 1,
                msg: err.message
              });
            } else {
              if(goodsDoc) {
                //增加商品数量和选择标志
                goodsDoc.productNum = '1'; //商品数量
                goodsDoc.checked = '1';
                userDoc.cartList.push(goodsDoc); //将商品加入到用户的购物车中
                userDoc.save(function(err2, userDoc2){
                  console.log('userDoc2');console.log(userDoc2);
                  if(err2) {
                    res.json({
                      status: 1,
                      msg: err2.message
                    });
                  } else {
                    res.json({
                      status: 0,
                      msg: '',
                      result: 'success'
                    });
                  }
                });
              }
            }
          })
        }
      }
    }
  });
});
module.exports = router;
