var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');
var pool = mysql.createPool($conf.mysql);
var Q = require('q');

/* 添加订单 */
function addOrder(items,date) {
    var defer = Q.defer();
    var str = 'INSERT INTO orders(user_id,store_id,goods_id,amount,orders_date,orders_state) VALUES ';
    for(i in items){
        str += '('+items[i].user_id+','+items[i].store_id+','+items[i].goods_id+','+items[i].goods_num+',"'+date+'",0),'
    }
    str = str.substring(0, str.length - 1);
    console.log(str);
    pool.getConnection(function (err, connection){
        connection.query(str,function (err,result) {
            if(!err){
                defer.resolve(true);
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
    addOrder:addOrder
}