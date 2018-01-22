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
router.get("/",function(req,res,next){
  /*
  let params = {};
  let page = parseInt(req.param("page"));//获取当前页面号码
  let pageSize = parseInt(req.param("pageSize")); //每页的条目数
  let priceLevel = req.param('priceLevel');
  let sort = req.param("sort"); //排序是升序还是降序
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
    }
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
  */

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
});

module.exports = router;
