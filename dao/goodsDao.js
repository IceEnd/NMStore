var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');
var pool = mysql.createPool($conf.mysql);
var Q = require('q');

function getGoodsByStoreId(store_id,start,amount) {
    var defer = Q.defer();
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * from goods where store_id = ' + store_id +' order by goods_id limit '+start+','+amount, function(err, result) {
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
    pool.getConnection(function (err,connection) {
        connection.query('SELECT count(*) from goods where store_id = '+store_id,function (err,result) {
            if(!err){
                defer.resolve(result[0]['count(*)']);
            }
            else{
                console.log(err);
                //defer.reject(err);
            }
            connection.release();
        });
    });
    return defer.promise;
}

module.exports = {
    getGoodsByStoreId:getGoodsByStoreId,
    getGoodsAmountByStoreId:getGoodsAmountByStoreId,
}
