/**
 * Created by Hello on 2017/12/3.
 */
var mongoose = require('mongoose');

//设计模式，暂时用不着的，可以使用Array这样的来代替
var userSchema = new mongoose.Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": Array,
  "cartList": [
    {
      "productId": String,
      "productName": String,
      "salePrice": String,
      "productImage": String,
      "checked": String,
      "productNum": String
    }
  ],
  "addressList": Array
  // "addressList": [
  //   {
  //     "addressId": String,
  //     "userName": String,
  //     "streetName": String,
  //     "postCode": Number,
  //     "tel": Number,
  //     "isDefault": Boolean
  //   }
  // ]
});

//定义一个user模型，"Users"大小写均可，关联集合users
module.exports = mongoose.model("User",userSchema);
