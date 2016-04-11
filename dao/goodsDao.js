var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');
var pool = mysql.createPool($conf.mysql);
var Q = require('q');

function getGoodsByStoreId(store_id, start, amount) {
    var defer = Q.defer();
    pool.getConnection(function(err, connection) {
        connection.query('select a.*,group_concat(b.images_id),group_concat(b.src) from goods as a left join  goods_images as b  on (a.goods_id = b.goods_id) where a.store_id = ' + store_id + 
        ' group by a.goods_id order by a.goods_id desc limit ' + start + ',' + amount, function(err, result) {
            if (!err) {      
                defer.resolve(result);
            }
            else {
                console.log(err);
                defer.reject(err);
            }
            connection.release();
        });
    });
    return defer.promise;
}

function getGoodsAmountByStoreId(store_id) {
    var defer = Q.defer();
    pool.getConnection(function(err, connection) {
        connection.query('SELECT count(*) from goods where store_id = ' + store_id, function(err, result) {
            if (!err) {
                defer.resolve(result[0]['count(*)']);
            }
            else {
                console.log(err);
                defer.reject(err);
            }
            connection.release();
        });
    });
    return defer.promise;
}

function getGoods(start, amount) {
    var defer = Q.defer();
    pool.getConnection(function (err,connection) {
        connection.query('select a.*,group_concat(b.images_id),group_concat(b.src) from goods as a left join  goods_images as b  on (a.goods_id = b.goods_id) where goods_state = 0'+
        ' group by a.goods_id order by a.goods_id desc limit ' + start + ',' + amount,function (err,result) {
            if(!err){
                defer.resolve(result);
            }
            else{
                console.log(err);
                defer.reject(err);
            }
            connection.release();
        });
    });
    return defer.promise;
}

function getGoodsAmount() {
    var defer = Q.defer();
    pool.getConnection(function(err, connection) {
        connection.query('SELECT count(*) from goods', function(err, result) {
            if (!err) {
                defer.resolve(result[0]['count(*)']);
            }
            else {
                console.log(err);
                defer.reject(err);
            }
            connection.release();
        });
    });
    return defer.promise;
}

/**
 * 添加商品
 */
function addGoods(goods, date, manager,store_id) {
    var defer = Q.defer();
    pool.getConnection(function(err, connection) {
        connection.query('INSERT INTO goods(goods_id,store_id,goods_name,price,stock,introduce,goods_source,manager,goods_date,cost,goods_state,sales_num) VALUE(0,?,?,?,?,?,?,?,?,?,?,?)',
            [parseInt(store_id),goods.goodsName, goods.goodsPrice, goods.goodsStock, goods.goodsIntroduce, goods.goodsSource, manager, date, goods.goodsCost, 0,0], function(err, result) {
                if (!err) {
                    defer.resolve(result.insertId);
                }
                else {
                    console.log(err);
                    defer.reject(err);
                }
            });
    });
    return defer.promise;
}

/**
 * 更新商品信息
 */
function updateGoods(goods,date,manager) {
    var defer = Q.defer();
    pool.getConnection(function (err,connection) {
        connection.query('UPDATE goods set goods_source = "'+goods.goodsSource+'",price='+goods.goodsPrice+',cost='+goods.goodsCost+',stock='+goods.goodsStock+',introduce="'+goods.goodsIntroduce+'",manager="'+manager+
        '" WHERE goods_id='+goods.goodsId,function (err,connection) {
            if(!err){
                defer.resolve(true);
            }
            else{
                console.log(goods.goodsId);
                console.log(err);
                defer.reject(err);
            }
        })
    });
    return defer.promise;
}

/**
 * 添加商品图片
 */
function addGoodsImg(images, goods_id) {
    var defer = Q.defer();
    if (images.length == 0) {
        refer.resolve(true);
    }
    else {
        var str = 'INSERT INTO goods_images(goods_id,src) VALUE ';
        for(var i = 0; i < images.length; i++){
            str += '('+goods_id+',"'+images[i]+'")';
            if(i <= images.length -2){
                str += ',';
            }
        }
        console.log(str);
        pool.getConnection(function(err, connection) {
            connection.query(str,function (err,result) {
                if(!err){
                    defer.resolve(true);
                }
                else{
                    console.log(err);
                    defer.reject(err);
                }
            })
        });
    }
    return defer.promise;
}

/**
 * 删除商品图片
 */
function removeGoodsImg(goods_id) {
    var defer = Q.defer();
    pool.getConnection(function (err,connection) {
        connection.query('delete from goods_images where goods_id='+goods_id,function (err,result) {
            if(!err){
                defer.resolve(true);
            }
            else{
                defer.reject(err);
            }
        })
    });
    return defer.promise;
}

/**
 * 添加库存
 */
function addGoodsStock(goods_id,stock,manager) {
    var defer = Q.defer();
    pool.getConnection(function (err,connection) {
        connection.query('update goods set stock = '+stock+',manager ="'+manager+'" where goods_id='+goods_id,
        function (err,result) {
            if(!err){
                defer.resolve(true);
            }
            else{
                console.log(err);
                defer.reject(err);
            }
        });
    });
    return defer.promise;
}

/**
 * 商品下架
 */
function outOfSale(goods_id,manager) {
    var defer = Q.defer();
    pool.getConnection(function (err,connection) {
        connection.query('update goods set goods_state = 1,manager ='+manager+' where goods_id='+goods_id,
        function (err,result) {
            if(!err){
                defer.resolve(true);
            }
            else{
                defer.reject(err);
            }
        });
    });
    return defer.promise;
}

module.exports = {
    getGoodsByStoreId: getGoodsByStoreId,
    getGoodsAmountByStoreId: getGoodsAmountByStoreId,
    getGoodsAmount:getGoodsAmount,
    getGoods:getGoods,
    addGoods: addGoods,
    addGoodsImg: addGoodsImg,
    updateGoods:updateGoods,
    removeGoodsImg:removeGoodsImg,
    addGoodsStock:addGoodsStock,
    outOfSale:outOfSale,
}
