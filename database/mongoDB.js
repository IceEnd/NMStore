var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/mnmstore');  //连接数据库
var mongodb = mongoose.connection;
var Schema = mongoose.Schema; // 创建模型

//商品模型
var goodsSchema = new Schema({
    good_id : Number,
    name : String,
    price : Number,
    stock : Number,
    introduce : String,
    picture : String,
    source : String,
    manager : String,
    manager_id : Number,
    date : String,
    number : Number,
    coat : Number
});

exports.goods = db.model('goods',goodsSchema);

//购物车模型
var carSchema = new Schema({
    user_id : Number,
    username : String,
    goods_id : Array,
    goods_name : Array,
    goods_amount : Array,
    goods_date : Array
})

exports.car = db.model('car',carSchema);