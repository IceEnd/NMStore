var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');
var pool = mysql.createPool($conf.mysql);
var Q = require('q');

/* 添加订单 */
function addOrder(items, date) {
    var defer = Q.defer();
    var str = 'INSERT INTO orders(user_id,store_id,goods_id,amount,orders_date,username,address,orders_state) VALUES ';
    for (i in items) {
        str += '(' + items[i].user_id + ',' + items[i].store_id + ',' + items[i].goods_id + ',' + items[i].goods_num + ',"' + date + '", "'+items[i].username+'","'+items[i].address+'",0),'
    }
    str = str.substring(0, str.length - 1);
    console.log(str);
    pool.getConnection(function (err, connection) {
        connection.query(str, function (err, result) {
            if (!err) {
                defer.resolve(true);
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

//商店未完成订单
function getStoreOrder(store_id,start,amount) {
    var defer = Q.defer();
    pool.getConnection(function (err, connection) {
        connection.query('select a.*,b.goods_name,c.name from orders as a left join goods as b on (a.goods_id = b.goods_id) left join store as c on (a.store_id = c.store_id) where a.store_id =' + store_id + ' AND a.orders_state in (0,1,2)  order by order_id desc limit '+start+','+amount,
            function (err, result) {
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

//商店全部订单
function getStoreAllOrder(store_id,start,amount) {
    var defer = Q.defer();
    pool.getConnection(function (err, connection) {
        connection.query('select a.*,b.goods_name,c.name from orders as a left join goods as b on (a.goods_id = b.goods_id) left join store as c on (a.store_id = c.store_id) where a.store_id =' + store_id +' order by order_id desc limit '+start+','+amount, function (err, result) {
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

//用户未完成
function getUserOrder(user_id,start,amount) {
    var defer = Q.defer();
    pool.getConnection(function (err, connection) {
        connection.query('select a.*,b.goods_name,c.name from orders as a left join goods as b on (a.goods_id = b.goods_id) left join store as c on (a.store_id = c.store_id) where a.user_id =' + user_id + ' AND a.orders_state in (0,1,2)  order by order_id desc limit '+start+','+amount,
            function (err, result) {
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

//商店全部订单
function getUserAllOrder(user_id,start,amount) {
    var defer = Q.defer();
    pool.getConnection(function (err, connection) {
        connection.query('select a.*,b.goods_name,c.name from orders as a left join goods as b on (a.goods_id = b.goods_id) left join store as c on (a.store_id = c.store_id) where a.user_id =' + user_id +' order by order_id desc limit '+start+','+amount, function (err, result) {
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

/**
 * 订单数量
 * type: true->商店   false->用户
 * flag: true->未完成 false->全部
 */
function getOrderAmount(id, type, flag) {
    var defer = Q.defer();
    var str = 'select count(*) from orders ';
    if (type) {
        //商店
        str += 'where store_id =' + id;
    }
    else {
        //用户
        str += 'where user_id =' + id;
    }
    if (flag) {
        //未完成
        str += '  AND orders_state in (0,1,2)';
    }
    pool.getConnection(function (err,connection) {
        connection.query(str,function (err,result) {
            if(!err){
                defer.resolve(result[0]['count(*)']);
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


module.exports = {
    addOrder: addOrder,                   //添加订单
    getStoreOrder: getStoreOrder,         //商店未完成订单
    getStoreAllOrder: getStoreAllOrder,   //商店所有订单
    getUserOrder:getUserOrder,            //用户未完成订单
    getUserAllOrder:getUserAllOrder,      //用户全部订单
    getOrderAmount:getOrderAmount,        //订单数量
}