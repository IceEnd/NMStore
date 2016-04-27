var express = require('express');
var router = express.Router();

var goodsDao = require('../dao/goodsDao.js');
var carsDao = require('../dao/carsDao.js');
var ordersDao = require('../dao/ordersDao');

var util = require('../common/util');

/* 进入购物车 */
router.get('/', function (req, res, next){
    var user = '';
    var user_type = ''; 
    if(req.cookies.username && req.cookies.user_type){
        //查询mysql
        user = req.cookies.username;
        user_type = req.cookies.user_type;
        carsDao.getCarsByUserId(req.cookies.user_id,0,20,true)
        .then(function (result) {
            res.render('car',{ title: 'NMStore', user: user, user_type: user_type,goods:result })
        });
    }
    else{
        res.redirect('../users/login');
    }
});

/* 删除 */
router.post('/del',function (req,res,next) {
   var items = req.body.cars.split(','); 
   carsDao.delItems(items)
   .then(function (result) {
       if(result){
           res.send({type:true});
           res.end();
       }
       else{
           res.send({type:false});
           res.end();
       }
   });
});

/* 加载更多 */
router.post('/more',function (req,res,next) {
    if(req.cookies.username && req.cookies.user_type){
        carsDao.getCarsByUserId(req.cookies.user_id,20*(parseInt(req.body.page)-1),20,true)
        .then(function (result) {
            console.log(result);
            res.send({"items":result});
            res.end();
        });
    }
})

/* 购买 */
router.post('/buy',function (req,res,next) {
    var fdate = new Date();
    var date = fdate.getFullYear()+'-'+(fdate.getMonth()+1)+'-'+fdate.getDate()+' '+fdate.getHours()+':'+fdate.getMinutes()+':'+fdate.getSeconds();
    var items,del_items=[],type = 0;
    carsDao.getItemsById(req.body.items.split(','))
    .then(function (result) {
        items = result;
        return true;
    },function (error) {
        type = 3;
        throw new Error('now I know this happened');
    })
    .then(function (result) {
        for(i in items){
            if(items[i].goods_state == 1){
                type = 1;
                del_items.push(items[i].car_id);
            }
            if(items[i].goods_num >= items[i].stock){  
                type = 2;   
                del_items.push(items[i].car_id);
            }
        }
        del_items =  util.uniqueArr(del_items);
        if(del_items.length == 0){
            return ordersDao.addOrder(items,date);
        }
        else{
            carsDao.delItems(del_items);
            throw new Error('now I know this happened');
        }
    },function (error) {
        type = 3;
        throw new Error('now I know this happened');
    })
    .then(function (result) {
        if(result){
            return goodsDao.addToOrder(items);
        }
    })
    .then(function (result) {
        del_items = [];
        for(i in items){
            del_items.push(items[i].car_id);
        }
        return carsDao.delItems(del_items);
    },function (error) {
        type = 3;
         throw new Error('now I know this happened');
    })
    .then(function (result) {
        type = 0;
    },function () {
        type = 3;
        throw new Error('now I know this happened');
    })
    .finally(function () {
        console.log('end');
        res.send({type:type});
        res.end();
    });
});

module.exports = router; 