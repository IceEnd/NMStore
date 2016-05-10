var express = require('express');
var router = express.Router();
var io = require('socket.io');

var userDao = require('../dao/userDao.js');
var goodsDao = require('../dao/goodsDao.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    var user = '';
    var user_type = '';
    if (req.cookies.username) {
        user = req.cookies.username;
        user_type = req.cookies.user_type;
    }
    var goods, amount = 0;
    goodsDao.getGoodsAmount()
        .then(function (count) {
            amount = count;
            return goodsDao.getGoods(0, 40);
        })
        .then(function (result) {
            goods = result;
        })
        .finally(function () {
            res.render('index', { title: 'NMStore', user: user, user_type: user_type, goods: goods, amount: amount, type: 0 });
        });
});

/* 加载更多商品 */
router.post('/more', function (req, res, next) {
    var goods, amount = 0;
    var page = parseInt(req.body.page);
    goodsDao.getGoodsAmount()
        .then(function (count) {
            amount = count;
            return goodsDao.getGoods(page * 40, 40);
        })
        .then(function (result) {
            goods = result;
        })
        .finally(function () {
            res.send({ goods: goods });
            res.end();
        });
});

/*搜索商品 */
router.get('/search', function (req, res, next) {
    var keyword = req.query.keyword;
    var user = '';
    var user_type = '';
    if (req.cookies.username) {
        user = req.cookies.username;
        user_type = req.cookies.user_type;
    }
    var goods, amount = 0;
    goodsDao.searchGoodsAmount(keyword)
        .then(function (result) {
            amount = result;
            return goodsDao.searchGoods(keyword, 0, 40);
        })
        .then(function (result) {
            goods = result;
        })
        .finally(function () {
            res.render('index', { title: 'NMStore', user: user, user_type: user_type, goods: goods, amount: amount, type: 1 });
        });
});

/**加载更多搜索商品 */
router.post('/smore', function (req, res, next) {
    var goods, amount = 0;
    var page = parseInt(req.body.page);
    var keyword = req.query.keyword;
    goodsDao.searchGoods(keyword,page * 40, 40)
        .then(function (result) {
            goods = result;
        })
        .finally(function () {
            res.send({ goods: goods });
            res.end();
        });
});

module.exports = router;
