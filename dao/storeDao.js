var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');
var pool = mysql.createPool($conf.mysql);
var Q = require('q');

//根据user_id得到store_id
function getStoreId(user_id) {
    var defer = Q.defer();
    pool.getConnection(function(err, connection) {
        connection.query('SELECT store_id FROM store_users where user_id = ' + user_id, function(err, result) {
            if (!err) {
                defer.resolve(result[0].store_id);
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

//根据store_id查询store
function getStore(store_id) {
    var defer = Q.defer();
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * from store where store_id = ' + store_id, function(err, result) {
            if (!err) {             
                defer.resolve(result[0]);
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
    getStoreId: getStoreId,
    getStore: getStore,
}