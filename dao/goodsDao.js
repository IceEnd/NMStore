var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');
var pool = mysql.createPool($conf.mysql);
var Q = require('q');

function getGoodsByStoreId(store_id) {
    var defer = Q.defer();
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * from goods where store_id = ' + store_id, function(err, result) {
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

module.exports = {
    getGoodsByStoreId:getGoodsByStoreId,
}