/**
 * Created by Hello on 2017/10/14.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//定义商品的模式
var productSchema = new Schema({
  "productId": {type: String},
  "productName": String,
  "salePrice": Number,
  "productImage": String,
  "checked": String,
  "productNum": String
});
//通过商品模式定义了商品模型Good（名字），会自动在单词后加上s，查找goods这个表。
module.exports = mongoose.model('Good',productSchema);
//或者指定和哪个表进行关联，加上第3个参数
// module.exports = mongoose.model('Good',productSchema,'goods');
