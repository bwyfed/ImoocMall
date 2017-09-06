/**
 * Created by Hello on 2017/9/6.
 */
var express = require("express");

var app = express();

app.get("/", function (req, res) {
  res.send("这是主页")
});

app.get(/^\/student\/([\d]{10})$/, function (req,res) {
  res.send("学生的学号：" + req.params[0]);
});

app.get("/teacher/:number",function (req,res) {
  res.send("老师的工号："+req.params.number);
})
app.listen(3000);
