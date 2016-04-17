var express = require('express');
var router = express.Router();

var goodsDao = require('../dao/goodsDao.js');
var carsDao = require('../dao/carsDao.js');

/* 商品详情 */
router.get('/', function (req, res, next) {
    var user = '';
    var user_type = '';
    if (req.cookies.username) {
        user = req.cookies.username;
        user_type = req.cookies.user_type;
    }

    if (req.query.hasOwnProperty('gid')) {
        goodsDao.getGoodsByGoodsId(req.query.gid)
            .then(function (result) {
                if (result) {
                    res.render('goods', { title: 'NMStore', user: user, user_type: user_type, goods: result[0] });
                }
                else {
                    res.render('error', { message: '页面不存在' });
                }
            });
    }
    else {
        res.render('error', { message: '页面不存在' });
    }
});

/* 添加到购物车 */
router.post('/addcar', function (req, res, next) {
    var fdate = new Date();
    date = fdate.getFullYear()+'-'+(fdate.getMonth()+1)+'-'+fdate.getDate()+' '+fdate.getHours()+':'+fdate.getMinutes()+':'+fdate.getSeconds();
    console.log(date);
    var car = JSON.parse(req.body.car);
    var updateCar = {};
    carsDao.getCarsByUserId(req.cookies.user_id)
        .then(function (result) {
            if (result[0].car_id) {
                for (c in car) {
                    for (r in result) {
                        if (result[r].goods_id == parseInt(c)) {
                            //更新数量
                            updateCar[result[r].car_id] = parseInt(result[r].goods_num) + parseInt(car[c]);
                            delete car[c];
                        }
                    }
                }
            }
        })
        .then(function () {
            //更新数量
            return carsDao.updateCars(updateCar);
        })
        .then(function (ures) {
            //插入购物车
            console.log(ures);
            if(ures){
                return carsDao.addCars(car,req.cookies.user_id,date);
            }
            else{
                return false;
            }
        })
        .then(function (flag) {
            if(flag){
                res.send(true)
            }
            else{
                res.send(false);
            }
            res.end();
        });
});

module.exports = router;