var express = require('express');
var router = express.Router();
var storeDao = require('../dao/storeDao.js');
var goodsDao = require('../dao/goodsDao.js');
var Q = require('q');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/', function(req, res, next) {
    if (req.cookies.user_type == '1' || req.cookies.user_type == '2') {
        var store_id,store,goods,amount;
        storeDao.getStoreId(req.cookies.user_id)
            .then(function(s_id) {
                store_id = s_id;
                return storeDao.getStore(store_id);
            })
            .then(function (rstore) {
                store = rstore;
                return goodsDao.getGoodsAmountByStoreId(store_id);
            })
            .then(function(ramount) {
                amount = ramount;
                return goodsDao.getGoodsByStoreId(store_id,0,20);
            })
            .then(function (rgoods) {
                goods = rgoods;
            })
            .finally(function() {
                res.render('storema', { title: 'NMStore', username: req.cookies.username, user_type: req.cookies.user_type,store:store,goods:goods,amount:amount});
            });
    }
    else {
        res.redirect('../');
    }
});

router.post('/addgoods',multipartMiddleware,function (req,res,next) {
   console.log(req.body);
   console.log(req.files);
   res.send({type:1});
});

module.exports = router;