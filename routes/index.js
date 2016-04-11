var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao.js');
var goodsDao = require('../dao/goodsDao.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = '';
  var user_type= '';
  if(req.cookies.username){
      user = req.cookies.username;
      user_type = req.cookies.user_type;
  }
  var goods,amount = 0;
  goodsDao.getGoodsAmount()
  .then(function (count) {
      amount = count;
      return goodsDao.getGoods(0,40)
  })
  .then(function (result) {
      goods = result;
  })
  .finally(function () {
      res.render('index', { title: 'NMStore',user: user,user_type:user_type,goods:goods,amount:amount});
  });
});



module.exports = router;
