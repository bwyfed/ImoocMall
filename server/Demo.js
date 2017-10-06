/**
 * Created by Hello on 2017/10/6.
 */
let user = require('./User');
console.log(`userName:${user.userName}`);
console.log(`I'm ${user.userName}, I say ${user.sayHello()}`);

let http= require('http');
let url = require('url');
let util = require('util');

let server = http.createServer((req,res)=>{
  res.statusCode = 200;

  res.setHeader("Content-Type","text/plain; charset=utf-8");

  console.log("url:"+req.url);  //字符串
  console.log("parse:"+url.parse(req.url));//req.url无法取到完整的URL [object Object]
  console.log("inspect:"+(util.inspect(url.parse(req.url))));  //对象的字符串表示
  res.end(util.inspect(url.parse(req.url)));  //对象的字符串表示
});

server.listen(3000,'127.0.0.1',()=>{
  console.log(`服务器已经运行，请打开浏览器，输入 http://127.0.0.1:3000 来进行访问`);
});
