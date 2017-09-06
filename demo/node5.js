/**
 * Created by Hello on 2017/9/6.
 */
//restful风格
var express = require("express");

var app = express();

//express是无视路由大小写的
app.get("/MyApp",function (req,res) {
  res.end("你好啊 myapp"); //这里有乱码
});

app.listen(3000);


