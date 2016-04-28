var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao.js');
var goodsDao = require('../dao/goodsDao');
var carsDao = require('../dao/carsDao');
var ordersDao = require('../dao/ordersDao');

/* GET users listing. */
router.get('/login', function (req, res, next) {
    res.render('login', { title: 'login' });
});

/* 会员注册 */
router.post('/mreg', function (req, res, next) {
    userDao.add(req, res, next);
});

/* 会员登陆 */
router.post('/mlogin', function (req, res, next) {
    var fdate = new Date();
    var date = fdate.getFullYear() + '-' + (fdate.getMonth() + 1) + '-' + fdate.getDate() + ' ' + fdate.getHours() + ':' + fdate.getMinutes() + ':' + fdate.getSeconds();
    var flag = false;
    var car;
    var updateCar = {};
    var user_id;
    userDao.memberLogin(req, res, next)
        .then(function (result) {
            if (result.length == 0) {
                res.send({ type: 1 });
                res.end();
            }
            else if (result.length == 1) {
                res.send({ type: 0, user_id: result[0].user_id });
                if (req.cookies.car) {
                    flag = true;
                    car = JSON.parse(req.cookies.car);
                    user_id = result[0].user_id;
                    return carsDao.getCarsByUserId(result[0].user_id);
                }
            }
            else {
                res.send({ type: 2 });
                res.end();
            }
        })
        .then(function (result) {
            if (flag) {
                if (result) {
                    for (c in car) {
                        console.log(c);
                        for (r in result) {
                            if (result[r].goods_id == parseInt(c)) {
                                //更新数量
                                updateCar[result[r].car_id] = parseInt(result[r].goods_num) + parseInt(car[c]);
                                delete car[c];
                            }
                        }
                    }
                }
            }
        })
        .then(function () {
            if (flag) {
                //更新数量
                return carsDao.updateCars(updateCar);
            }
        })
        .then(function (result) {
            if (flag) {
                if (result) {
                    return carsDao.addCars(car, user_id, date);
                }
            }
        });
});

router.post('/sreg', function (req, res, next) {
    userDao.storeLogin(req, res, next);
});

//未完成订单
router.get('/', function (req, res, next) {
    if (req.cookies.user_id) {
        var user, orders, amount, page, type = 0;
        userDao.getUserById(req.cookies.user_id)
            .then(function (result) {
                user = result;
                return ordersDao.getOrderAmount(req.cookies.user_id, flag, true);
            }, function (error) {
                type = 1;
                throw new Error('now I know this happened');
            })
            .then(function (result) {
                amount = result;
                console.log(result);
                if (req.query.page) {
                    page = req.query.page;
                    return ordersDao.getUserOrder(req.cookies.store_id, (page - 1) * 20, 20);
                }
                else {
                    page = 1;
                    return ordersDao.getUserOrder(req.cookies.store_id, 0, 20);
                }
            }, function (err) {
                type = 1;
                throw new Error('now I know this happened');
            })
            .then(function (result) {
                orders = result;
            }, function (error) {
                type = 1;
                throw new Error('now I know this happened');
            })
            .finally(function () {
                if (type == 0) {
                    console.log(orders[0]);
                    res.render('useror', { title: 'NMStore', username: req.cookies.username, user_type: req.cookies.user_type, store: store, orders: orders, amount: amount, page: page });
                }
                else {
                    res.render('error', { message: '404' });
                }
            });
    }
    else {
        res.redirect('../users/login');
    }
});

//全部订单
router.get('/allorder',function (req,res,next) {
    if (req.cookies.user_id){
        var store, orders, amount, page, type = 0;
         userDao.getUserById(req.cookies.user_id)
            .then(function (result) {
                user = result;
                return ordersDao.getOrderAmount(req.cookies.user_id, false, false);
            }, function (error) {
                type = 1;
                throw new Error('now I know this happened');
            })
            .then(function (result) {
                amount = result;
                console.log(result);
                if (req.query.page) {
                    page = req.query.page;
                    return ordersDao.getUserOrder(req.cookies.store_id, (page - 1) * 20, 20);
                }
                else {
                    page = 1;
                    return ordersDao.getUserOrder(req.cookies.store_id, 0, 20);
                }
            }, function (err) {
                type = 1;
                throw new Error('now I know this happened');
            })
            .then(function (result) {
                orders = result;
            }, function (error) {
                type = 1;
                throw new Error('now I know this happened');
            })
            .finally(function () {
                if (type == 0) {
                    console.log(orders[0]);
                    res.render('userallor', { title: 'NMStore', username: req.cookies.username, user_type: req.cookies.user_type, store: store, orders: orders, amount: amount, page: page });
                }
                else {
                    res.render('error', { message: '404' });
                }
            });
    }
    else{
        res.redirect('../users/login');
    }
});

module.exports = router;
