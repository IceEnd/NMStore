var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');
var pool = mysql.createPool($conf.mysql);
var Q = require('q');

function getGoodsByStoreId(store_id, start, amount) {
    var defer = Q.defer();
    pool.getConnection(function(err, connection) {
        connection.query('select a.*,group_concat(b.src) from goods as a left join  goods_images as b  on (a.goods_id = b.goods_id) where a.store_id = ' + store_id + 
        ' group by a.goods_id order by a.goods_id desc limit ' + start + ',' + amount, function(err, result) {
            if (!err) {      
                console.log(result);
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
 * 添加商品图片
 */
function addGoodsImg(images, good_id) {
    var defer = Q.defer();
    if (images.length == 0) {
        refer.resolve(true);
    }
    else {
        var str = 'INSERT INTO goods_images(goods_id,src) VALUE ';
        for(var i = 0; i < images.length; i++){
            str += '('+good_id+',"'+images[i]+'")';
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
                    defer.reject(err);
                }
            })
        });
    }
    return defer.promise;
}

module.exports = {
    getGoodsByStoreId: getGoodsByStoreId,
    getGoodsAmountByStoreId: getGoodsAmountByStoreId,
    addGoods: addGoods,
    addGoodsImg: addGoodsImg,
}
