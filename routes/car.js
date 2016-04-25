var express = require('express');
var router = express.Router();

var goodsDao = require('../dao/goodsDao.js');
var carsDao = require('../dao/carsDao.js');

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

module.exports = router; 