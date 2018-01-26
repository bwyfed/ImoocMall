/**
 * Created by Hello on 2017/10/6.
 */
let http= require('http');
let url = require('url');
let util = require('util');

let fs = require('fs');

let server = http.createServer((req,res)=>{
  res.statusCode = 200;

  res.setHeader("Content-Type","text/plain; charset=utf-8");
  // console.log("url:"+req.url); //demo.html?a=123
  // console.log("parse:"+url.parse(req.url)); //[object Object]
  // console.log("inspect:"+util.inspect(url.parse(req.url))); //字符串输出
  // res.end(util.inspect(url.parse(req.url)));

  //加载静态页面，创建容器
  let pathname = url.parse(req.url).pathname;
  fs.readFile(pathname.substring(1),function(err,data) {
    if(err) {
      res.writeHead(404,{
        'Content-Type': 'text/html'
      });
    } else {
      res.writeHead(200,{
        'Content-Type': 'text/html'
      });
      res.write(data.toString());
    }
    res.end();  //响应结束
  });
});

server.listen(3000,'127.0.0.1',()=>{
  console.log(`服务器已经运行，请打开浏览器，输入 http://127.0.0.1:3000 来进行访问`);
});
