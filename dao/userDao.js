/**
 * userDao层,完成对user表增删改查功能
 */
var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');


var pool = mysql.createPool($conf.mysql);

/*会员注册 */
function add(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM users WHERE username = "' + req.body.username + '"', function(err, result) {
            if (!err) {
                if (result.length > 0) {
                    //用户名重复
                    res.send({ type: 1 });
                }
                else {
                    //注册
                    connection.query('INSERT INTO users(user_id,username,phone,pwd,address,user_type) VALUES(0,?,?,?,?,?)', [req.body.username, req.body.phone, req.body.pwd, req.body.address, 3], function(err, result) {
                        if (result) {
                            console.log(result);
                            res.send({ type: 0 });
                        }
                    });
                }
            }
            connection.release();
        });
    });
};

/*会员登录 */
function memberLogin(req, res, next) {
    pool.getConnection(function(err, connection) {

        connection.query('SELECT * FROM users WHERE username ="' + req.body.username + '" and pwd = "' + req.body.pwd + '" and user_type = "' + req.body.user_type + '"', function(err, result) {
            if (!err) {
                console.log(result.length);
                if (result.length == 0) {
                    //用户名或密码错误
                    console.log('sss');
                    res.send({ type: 1 });
                }
                else if (result.length == 1) {
                    //登录成功+创建session
                    console.log('登陆成功');
                    res.send({ type: 0 });
                }
                else {
                    console.log('其他错误');
                    res.send({ type: 2 });
                }
            }
            else {
                //网络连接错误
                console.log('dddd');
                res.send({ type: 2 });
            }
        });
        connection.release();
    });
};

function storeLogin(req, res, next) {
    var user_id, store_id;
    var resDate = new Date();
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM users WHERE username = "' + req.body.username + '"', function(err, result) {
            if (!err) {
                if (result.length > 0) {
                    //用户名重复
                    res.send({ type: 1 });
                    return;
                }
                else {
                    //用户名为重复,users、store、store_users表插入
                    connection.query('INSERT INTO users(user_id,username,phone,pwd,address,user_type) VALUES(0,?,?,?,?,?)',
                        [req.body.username, req.body.phone, req.body.pwd, req.body.address, 1], function(err, result) {
                            if (!err) {
                                user_id = result.insertId;
                                connection.query('Insert INTO store(store_id,name,username,idcard,phone,address,store_date,store_state) values(0,?,?,?,?,?,?,?)',
                                    [req.body.name, req.body.username, req.body.idcard, req.body.phone, req.body.address, resDate, 1], function(err, result) {
                                        if (!err) {
                                            store_id = result.insertId;
                                            connection.query('Insert Into store_users(su_id,store_id,user_id) values(0,?,?)',
                                                [store_id, user_id], function(err, result) {
                                                    if (!err) {
                                                        res.send({ type: 0 });
                                                    }
                                                    else {
                                                        res.send({ type: 2 });
                                                    }
                                                });
                                        }
                                        else {
                                            console.log(err);
                                            res.send({ type: 2 });
                                        }
                                    });
                          }
                          else {
                              res.send({ type: 2 });
                          }
                    });
                }
            }
        });
        connection.release();
    });
};

module.exports = {
    add: add,
    memberLogin: memberLogin,
    storeLogin: storeLogin,
};