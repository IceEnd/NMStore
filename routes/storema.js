var express = require('express');
var router = express.Router();
var Q = require('q');
var fs = require('fs');
var formidable = require("formidable");

var storeDao = require('../dao/storeDao.js');
var goodsDao = require('../dao/goodsDao.js');
var util = require('../common/util.js');

router.get('/', function(req, res, next) {
    if (req.cookies.user_type == '1' || req.cookies.user_type == '2') {
        var store_id, store, goods, amount, page;
        storeDao.getStoreId(req.cookies.user_id)
            .then(function(s_id) {
                store_id = s_id;
                return storeDao.getStore(store_id);
            })
            .then(function(rstore) {
                store = rstore;
                return goodsDao.getGoodsAmountByStoreId(store_id);
            })
            .then(function(ramount) {
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
            .then(function(rgoods) {
                goods = rgoods;
            })
            .finally(function() {
                res.render('storema', { title: 'NMStore', username: req.cookies.username, user_type: req.cookies.user_type, store: store, goods: goods, amount: amount, page: page });
            });
    }
    else {
        res.redirect('../users/login');
    }
});

router.post('/addgoods', function(req, res, next) {
    var date = new Date();
    var uploadDir = "./public/upload/" + date.getFullYear();
    var img_url = [], goods_info;
    var success_flag = false;
    util.mkdirUpload(uploadDir)
        .then(function(flag) {
            if (flag) {
                uploadDir = "./public/upload/" + date.getFullYear() + "/" + date.getMonth();
                return util.mkdirUpload(uploadDir)
            }
        })
        .then(function(flag) {
            if (flag) {
                uploadDir = "./public/upload/" + date.getFullYear() + "/" + date.getMonth();
                return util.uploadImg(req, res, next, date, uploadDir);
            }
        })
        .then(function(goods) {
            goods_info = goods['goods'];
            img_url = goods['img_url'];
            return goodsDao.addGoods(goods_info, date, req.cookies.username, req.cookies.store_id);
        })
        .then(function(goods_id) {
            goods_info.goodsId = goods_id;
            if (goods_info.imgLength > 0) {
                return goodsDao.addGoodsImg(img_url, goods_id);
            }
            else {
                return true;
            }
        })
        .then(function(type) {
            if (type) {
                success_flag = true;
            }
        })
        .finally(function() {
            if (success_flag) {
                console.log(img_url);
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
router.post('/upgoods', function(req, res, next) {
    var date = new Date();
    var uploadDir = "./public/upload/" + date.getFullYear();
    var img_url = [], goods_info;
    var success_flag = false;

    util.mkdirUpload(uploadDir)
        .then(function(flag) {
            if (flag) {
                uploadDir = "./public/upload/" + date.getFullYear() + "/" + date.getMonth();
                return util.mkdirUpload(uploadDir);
            }
        })
        .then(function(flag) {
            if (flag) {
                uploadDir = "./public/upload/" + date.getFullYear() + "/" + date.getMonth();
                return util.uploadImg(req, res, next, date, uploadDir);
            }
        })
        .then(function(goods) {
            goods_info = goods['goods'];
            img_url = goods['img_url'];
            return goodsDao.updateGoods(goods_info,date,req.cookies.username);
        })
        .then(function (flag) {
            if(goods_info.imgLength == 0){
                success_flag = true;
                return true;
            }
            else{
                return goodsDao.removeGoodsImg(goods_info.goodsId);
            }
        })
        .then(function (flag) {
            if(flag){
                return goodsDao.addGoodsImg(img_url,goods_info.goodsId);
            }
        })
        .then(function (flag) {
            if(flag){
                success_flag = true;
            }
        })
        .finally(function () {
            if(success_flag){
                res.send({'type':0,'images':img_url});
                res.end();
            }
            else{
                res.send({ 'type': 1 });
                res.end();
            }
        });
});

//添加库存
router.post('/addstock', function(req, res, next){
    goodsDao.addGoodsStock(req.body.goods_id,req.body.goods_stock,req.cookies.username)
    .then(function (flag) {
        if(flag){
            res.send({'type':0});
            res.end();
        }
        else{
            res.send({'type':1});
            res.end();
        }
    });
});

//商品下架
router.post('/outsale', function(req, res, next){
    goodsDao.outOfSale(req.body.goods_id,req.cookies.username)
    .then(function (flag) {
        if(flag){
            res.send({'type':0});
            res.end();
        }
        else{
            res.send({"type":1});
            res.send();
        }
    });
});

module.exports = router;