/**
 * Created by Hello on 2017/9/6.
 */
var http = require("http");

var server = http.createServer(function(req,res){
  var userurl = req.url;
  res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
  if(userurl.substr(0,9) =="/student/") {
    var studentId = userurl.substr(9);
    if(/^\d{10}$/.test(studentId)) {
      res.end("您当前查询的学生信息，id为：" + studentId);
    } else {
      res.end("学生学号不对");
    }

  } else if(userurl.substr(0,9)=="/teacher/") {
    var teacherId = userurl.substr(9);
    res.end("您当前查询的老师信息，id为：" + teacherId);
  } else {
    res.end("招不到页面啦，not found page");
  }
})

server.listen(3000,"127.0.0.1");
