/**
 * Created by Hello on 2017/9/6.
 */
var express = require("express");

var app = express();
// ./是因为有Linux和Windows系统，是为了兼容
app.use(express.static("./public"));  //index.html是默认的

app.listen(3000);
