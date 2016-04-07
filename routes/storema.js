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
        var store_id, store, goods, amount;
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
                return goodsDao.getGoodsByStoreId(store_id, 0, 20);
            })
            .then(function(rgoods) {
                goods = rgoods;
            })
            .finally(function() {
                res.render('storema', { title: 'NMStore', username: req.cookies.username, user_type: req.cookies.user_type, store: store, goods: goods, amount: amount });
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
            if(goods_info.imgLength > 0){
                return goodsDao.addGoodsImg(img_url, goods_id);
            }
            else{
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
                res.send({ 'type': 0, 'new_goods': goods_info });
                res.end();
            }
            else {
                res.send({ 'type': 1 });
                res.end();
            }
        });
});

module.exports = router;