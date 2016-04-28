var express = require('express');
var router = express.Router();
var Q = require('q');
var fs = require('fs');
var formidable = require("formidable");

var storeDao = require('../dao/storeDao');
var goodsDao = require('../dao/goodsDao');
var ordersDao = require('../dao/ordersDao');
var util = require('../common/util');

router.get('/', function (req, res, next) {
    if (req.cookies.user_type == '1' || req.cookies.user_type == '2') {
        var store_id, store, goods, amount, page;
        storeDao.getStoreId(req.cookies.user_id)
            .then(function (s_id) {
                store_id = s_id;
                return storeDao.getStore(store_id);
            })
            .then(function (rstore) {
                store = rstore;
                return goodsDao.getGoodsAmountByStoreId(store_id);
            })
            .then(function (ramount) {
                amount = ramount;
                if (req.query.page) {
                    page = req.query.page;
                    return goodsDao.getGoodsByStoreId(store_id, (page - 1) * 20, 20);
                }
                else {
                    page = 1;
                    return goodsDao.getGoodsByStoreId(store_id, 0, 20);
                }

            })
            .then(function (rgoods) {
                goods = rgoods;
            })
            .finally(function () {
                res.render('storema', { title: 'NMStore', username: req.cookies.username, user_type: req.cookies.user_type, store: store, goods: goods, amount: amount, page: page });
            });
    }
    else {
        res.redirect('../users/login');
    }
});

router.post('/addgoods', function (req, res, next) {
    var date = new Date();
    var uploadDir = "./public/upload/" + date.getFullYear();
    var img_url = [], goods_info;
    var success_flag = false;
    util.mkdirUpload(uploadDir)
        .then(function (flag) {
            if (flag) {
                uploadDir = "./public/upload/" + date.getFullYear() + "/" + (date.getMonth() + 1);
                return util.mkdirUpload(uploadDir)
            }
        })
        .then(function (flag) {
            if (flag) {
                uploadDir = "./public/upload/" + date.getFullYear() + "/" + date.getMonth();
                return util.uploadImg(req, res, next, date, uploadDir);
            }
        })
        .then(function (goods) {
            goods_info = goods['goods'];
            img_url = goods['img_url'];
            return goodsDao.addGoods(goods_info, date, req.cookies.username, req.cookies.store_id);
        })
        .then(function (goods_id) {
            goods_info.goodsId = goods_id;
            if (goods_info.imgLength > 0) {
                return goodsDao.addGoodsImg(img_url, goods_id);
            }
            else {
                return true;
            }
        })
        .then(function (type) {
            if (type) {
                success_flag = true;
            }
        })
        .finally(function () {
            if (success_flag) {
                res.send({ 'type': 0, 'new_goods': goods_info, 'images': img_url });
                res.end();
            }
            else {
                res.send({ 'type': 1 });
                res.end();
            }
        });
});

/**
 * 更新商品信息
 */
router.post('/upgoods', function (req, res, next) {
    var date = new Date();
    var uploadDir = "./public/upload/" + date.getFullYear();
    var img_url = [], goods_info;
    var success_flag = false;

    util.mkdirUpload(uploadDir)
        .then(function (flag) {
            if (flag) {
                uploadDir = "./public/upload/" + date.getFullYear() + "/" + date.getMonth();
                return util.mkdirUpload(uploadDir);
            }
        })
        .then(function (flag) {
            if (flag) {
                uploadDir = "./public/upload/" + date.getFullYear() + "/" + date.getMonth();
                return util.uploadImg(req, res, next, date, uploadDir);
            }
        })
        .then(function (goods) {
            goods_info = goods['goods'];
            img_url = goods['img_url'];
            return goodsDao.updateGoods(goods_info, date, req.cookies.username);
        })
        .then(function (flag) {
            if (goods_info.imgLength == 0) {
                success_flag = true;
                return true;
            }
            else {
                return goodsDao.removeGoodsImg(goods_info.goodsId);
            }
        })
        .then(function (flag) {
            if (flag) {
                return goodsDao.addGoodsImg(img_url, goods_info.goodsId);
            }
        })
        .then(function (flag) {
            if (flag) {
                success_flag = true;
            }
        })
        .finally(function () {
            if (success_flag) {
                res.send({ 'type': 0, 'images': img_url });
                res.end();
            }
            else {
                res.send({ 'type': 1 });
                res.end();
            }
        });
});

//添加库存
router.post('/addstock', function (req, res, next) {
    goodsDao.addGoodsStock(req.body.goods_id, req.body.goods_stock, req.cookies.username)
        .then(function (flag) {
            if (flag) {
                res.send({ 'type': 0 });
                res.end();
            }
            else {
                res.send({ 'type': 1 });
                res.end();
            }
        });
});

//商品下架
router.post('/outsale', function (req, res, next) {
    goodsDao.outOfSale(req.body.goods_id, req.cookies.username)
        .then(function (flag) {
            if (flag) {
                res.send({ 'type': 0 });
                res.end();
            }
            else {
                res.send({ "type": 1 });
                res.send();
            }
        });
});


//未完成订单
router.get('/order', function (req, res, next) {
    if (req.cookies.user_type == '1' || req.cookies.user_type == '2') {
        var store, orders, amount, page, type = 0;
        storeDao.getStore(req.cookies.store_id)
            .then(function (result) {
                store = result;
                return ordersDao.getOrderAmount(req.cookies.store_id, true, true);
            }, function (error) {
                type = 1;
                throw new Error('now I know this happened');
            })
            .then(function (result) {
                amount = result;
                if (req.query.page) {
                    page = req.query.page;
                    return ordersDao.getStoreOrder(req.cookies.store_id, (page - 1) * 20, 20);
                }
                else {
                    page = 1;
                    return ordersDao.getStoreOrder(req.cookies.store_id, 0, 20);
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
                    res.render('storeor', { title: 'NMStore', username: req.cookies.username, user_type: req.cookies.user_type, store: store, orders: orders, amount: amount, page: page });
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
router.get('/allorder', function (req, res, next) {
    if (req.cookies.user_type == '1' || req.cookies.user_type == '2') {
        var store, orders, amount, page, type = 0;
        storeDao.getStore(req.cookies.store_id)
            .then(function (result) {
                store = result;
                return ordersDao.getOrderAmount(req.cookies.store_id, true, false);
            }, function (error) {
                type = 1;
                throw new Error('now I know this happened');
            })
            .then(function (result) {
                amount = result;
                if (req.query.page) {
                    page = req.query.page;
                    return ordersDao.getStoreAllOrder(req.cookies.store_id, (page - 1) * 20, 20);
                }
                else {
                    page = 1;
                    return ordersDao.getStoreAllOrder(req.cookies.store_id, 0, 20);
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
                    res.render('storeallor', { title: 'NMStore', username: req.cookies.username, user_type: req.cookies.user_type, store: store, orders: orders, amount: amount, page: page });
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

//卖家取消
router.post('/corder', function (req, res, next) {
    var type = 0;
    var fdate = new Date();
    var date = fdate.getFullYear() + '-' + (fdate.getMonth() + 1) + '-' + fdate.getDate() + ' ' + fdate.getHours() + ':' + fdate.getMinutes() + ':' + fdate.getSeconds();
    var order;
    ordersDao.getOrderById(req.body.order_id)
        .then(function (result) {
            order = result[0];
            if (result[0].orders_state == 3) {
                type = 1;
                throw new Error('now I know this happened');
            }
            else {
                return ordersDao.cancelOrder(false, req.body.order_id, date, req.cookies.username);
            }
        }, function (error) {
            type = 2;
            throw new Error('now I know this happened');
        })
        .then(function (result) {
            return goodsDao.addOrderToGoods(order);
        }, function (error) {
            type = 2;
            throw new Error('now I know this happened');
        })
        .then(function (result) {
            type = 0;
        },function (error) {
            type = 2;
            throw new Error('now I know this happened');
        })
        .finally(function () {
            res.send({ "type": type });
            res.end();
        });
});

//卖家接单
router.post('/torder', function (req, res, next) {
    var type = 0;
    var fdate = new Date();
    var date = fdate.getFullYear() + '-' + (fdate.getMonth() + 1) + '-' + fdate.getDate() + ' ' + fdate.getHours() + ':' + fdate.getMinutes() + ':' + fdate.getSeconds();
    ordersDao.getOrderById(req.body.order_id)
        .then(function (result) {
            if (result[0].orders_state == 3) {
                type = 1;
                throw new Error('now I know this happened');
            }
            else {
                return ordersDao.takeOrder(req.body.order_id, date, req.cookies.username);
            }
        }, function (error) {
            type = 2;
            throw new Error('now I know this happened');
        })
        .then(function (result) {         
            type = 0;
        }, function (error) {
            type = 2;
            throw new Error('now I know this happened');
        })
        .finally(function () {
            res.send({ "type": type });
            res.end();
        });
});

//卖家发货
router.post('/sorder', function (req, res, next) {
    var type = 0;
    var fdate = new Date();
    var date = fdate.getFullYear() + '-' + (fdate.getMonth() + 1) + '-' + fdate.getDate() + ' ' + fdate.getHours() + ':' + fdate.getMinutes() + ':' + fdate.getSeconds();
    ordersDao.getOrderById(req.body.order_id)
        .then(function (result) {
            console.log(result[0].orders_state);
            if (result[0].orders_state == 3) {
                type = 1;
                return false;
            }
            else {
                return ordersDao.sendOrder(req.body.order_id, date, req.cookies.username);
            }
        }, function (error) {
            console.log(2);
            type = 2;
            throw new Error('now I know this happened');
        })
        .then(function (result) {    
            if(result){
                type = 0;
            }
            else{
                type = 1;
            }
        }, function (error) {    
            type = 2;
            throw new Error('now I know this happened');
        })
        .finally(function () {
            res.send({ "type": type });
            res.end();
        });
});

module.exports = router;