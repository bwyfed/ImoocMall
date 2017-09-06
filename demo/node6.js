/**
 * Created by Hello on 2017/9/6.
 */
var express = require("express");

var app = express();

//当输入localhost:3000/admin/login时，会输出1
//优先匹配这个路由 可以调整路由的位置来达到设置路由匹配顺序的问题
app.get("/:username/:id",function(req,res){
  console.log("1");
  var id = req.params["id"];
  if(/^[\d]{6}$/.test(id)) {
    res.send(id);
  } else {
    res.send("你搞错了");
  }
})
app.get("/admin/login", function (req,res) {
  console.log("2");
  res.send("后台登录 ~~~");
});

/*
 app.get("/:username/:id",function(req,res,next){
 console.log("1");
 var id = req.params["id"];
 if(/^[\d]{6}$/.test(id)) {
 res.send(id);
 } else {
  next();
 }
 })
 app.get("/admin/login", function (req,res) {
 console.log("2");
 res.send("后台登录 ~~~");
 });
 */
app.listen(3000);
