var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/mnmstore');  //连接数据库
var db = mongoose.connection;
var Schema = mongoose.Schema; // 创建模型

//商品模型
var goodSchema = new Schema({
    goods_id:Number,
    goods_name:String,
    price:Number,
    stock:Number,
    introduce:String,
    picture:Array,
    source:String,
    manager:String,
    manager_id:Number,
    date:String,
    number:Number,
    cost:Number
});

// 与users集合关联
exports.goods = db.model('users', userSchema);

var carsSchema = new Schema({
    user_id:Number,
    username:String,
    goods_id:Array,
    goods_name:Array,
    goods_amout:Array,
    goods_date:Array
});

exports.cars = db.model('cars',orderSchema);
