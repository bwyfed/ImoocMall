/**
 * Created by Hello on 2017/10/6.
 */

const http = require('http');
const util = require('util');

http.get('http://www.imooc.com/u/card',(res)=> {
  let data = '';
  //监听数据的接收，因为不能一次性的接收所有数据
  res.on("data",function(chunk){
    data += chunk;
  });
  res.on("end",function(){
    let result = JSON.parse(data);
    console.log("result:"+util.inspect(result));
  })
})
