/**
 * Created by Hello on 2017/10/6.
 */
//默认输出
/*
module.exports = {
  userName: "Jack",
  sayHello: function () {
    return 'Hello';
  }
}
*/

//逐个暴露key
exports.userName = "Tom";
exports.sayHello = function() {
  return 'World';
}
