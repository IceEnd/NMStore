var express = require('express');
var router = express.Router();

var goodsDao = require('../dao/goodsDao');
var carsDao = require('../dao/carsDao');
var ordersDao = require('../dao/ordersDao');

/* start */
router.get('/', function (req, res, next) {
    var user = '';
    var user_type = '';
    if (req.cookies.username && req.cookies.user_type) {
        user = req.cookies.username;
        user_type = req.cookies.user_type;
        if (req.query.hasOwnProperty('gid') && req.query.hasOwnProperty('num')) {
            goodsDao.getGoodsByGoodsId(req.query.gid)
                .then(function (result) {
                    if (result) {
                        res.render('shopping', { title: 'NMStore', user: user, user_type: user_type, goods: result[0], num: req.query.num });
                    }
                    else {
                        res.render('error', { message: '页面不存在' });
                    }
                })
        }
        else {
            res.render('error', { message: '页面不存在' });
        }
    }
    else {
        res.redirect('../users/login');
    }
});

//购买
router.post('/buy', function (req, res, next) {
    var fdate = new Date();
    var date = fdate.getFullYear() + '-' + (fdate.getMonth() + 1) + '-' + fdate.getDate() + ' ' + fdate.getHours() + ':' + fdate.getMinutes() + ':' + fdate.getSeconds();
    var items, del_items = [], type = 0;
    goodsDao.getGoodsByGoodsId(req.body.goods_id)
        .then(function (result) {
            if (result[0].goods_id) {
                console.log(result[0].stock);
                if (result[0].stock >= req.body.num) {
                    items = result;
                    items[0].goods_num = req.body.num;
                    items[0].user_id = req.cookies.user_id;
                    return ordersDao.addOrder(items, date);
                } else {
                    type = 2;
                    throw new Error('now I know this happened');
                }
            }
            else {
                type = 1;
                throw new Error('now I know this happened');
            }
        }, function (error) {
            type = 3;
            throw new Error('now I know this happened');
        })
        .then(function (result) {
            return goodsDao.addToOrder(items); 
        }, function (error) {
            type = 3;
            throw new Error('now I know this happened');
        })
        .then(function (result) {
            if(result){
                type = 0;
            }
        },function (error) {
            type = 3;
            throw new Error('now I know this happened');
        })
        .finally(function () {
            res.send({type:type});
            res.end();
        });
});

module.exports = router;