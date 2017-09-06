/**
 * Created by Hello on 2017/9/6.
 */
/**
 * <% %> <?php>
 * 使用ejs或者jade模板
 */

var express = require("express");

var app = express();

app.set("view engine", "ejs");  //设置视图引擎

app.get("/", function (req, res) {
  //模板渲染使用render
  res.render("haha",{ //因为指定了模板类型，默认省略了文件后缀名
    news: ["哈哈","嘿嘿","傻逼"]
  })
})

app.listen(3000);
