var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');
var pool = mysql.createPool($conf.mysql);
var Q = require('q');

//判断对象是否为空
function isEmptyObject(obj) {
    for (var n in obj) { return false }
    return true;
}

/* 查询用户购物车 */
function getCarsByUserId(user_id, s, e,flag) {
    var defer = Q.defer();
    var str = 'select a.*,b.*,c.src from cars as a left join  goods as b on (a.goods_id = b.goods_id) left join goods_images as c on (a.goods_id = c.goods_id) where b.goods_state = 0 AND a.user_id = ' +
        user_id + ' group by a.car_id order by a.car_id desc ';
    if (flag) {
        str += 'limit '+s +','+e;
    }
    pool.getConnection(function (err, connection) {
        connection.query(str,
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

/* 添加到购物车 */
function addCars(car, user_id, date) {
    var defer = Q.defer();
    if (!isEmptyObject(car)) {
        var str = 'INSERT INTO cars(user_id,goods_id,goods_num,car_date) VALUES ';
        for (c in car) {
            str += '(' + user_id + "," + c + ',' + car[c] + ',"' + date + '"),'
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
    }
    else {
        defer.resolve(true);
    }
    return defer.promise;
}

/* 更新数量 */
function updateCars(updateCar) {
    var defer = Q.defer();
    if (!isEmptyObject(updateCar)) {
        var str = 'UPDATE cars set goods_num = case car_id';
        for (u in updateCar) {
            str += ' when ' + u + ' then ' + updateCar[u]
        }
        str += ' end where car_id in (';
        for (u in updateCar) {
            str += u + ','
        }
        str = str.substring(0, str.length - 1);
        str += ')';
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
    }
    else {
        defer.resolve(true);
    }
    return defer.promise;
}


/* 删除购物车中项目 */
function delItems(items) {
    var defer = Q.defer();
    var str = 'DELETE FROM cars where car_id in (';
    for(i in items){
        str += items[i]+',';
    }
    str = str.substring(0,str.length-1);
    str += ')';
    pool.getConnection(function (err,connection) {
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
    getCarsByUserId: getCarsByUserId,
    updateCars: updateCars,
    addCars: addCars,
    delItems:delItems,
}