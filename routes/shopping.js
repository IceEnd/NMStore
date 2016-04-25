var express = require('express');
var router = express.Router();

var goodsDao = require('../dao/goodsDao.js');
var carsDao = require('../dao/carsDao.js');

/*立即购买 */
router.get('/',function (req,res,next) {
    var user = '';
    var user_type = '';
    if(req.cookies.username && req.cookies.user_type){
        user = req.cookies.username;
        user_type = req.cookies.user_type;
        if (req.query.hasOwnProperty('gid') && req.query.hasOwnProperty('num')){
            goodsDao.getGoodsByGoodsId(req.query.gid)
            .then(function (result) {
                if(result){
                    //0:立即购买  1：购物车购买
                    res.render('shopping', { title: 'NMStore', user: user, user_type: user_type, goods: result[0],type:0,num:req.query.num});
                }
                else{
                    res.render('error', { message: '页面不存在' });
                }
            })
        }
        else{
            res.render('error',{message:'页面不存在'});
        }
    }
    else{
        res.redirect('../users/login');
    }
});

module.exports = router;