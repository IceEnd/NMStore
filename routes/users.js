var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao.js');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login',{title:'login'});
});

/* 会员注册 */
router.post('/mreg',function (req,res,next) {
    userDao.add(req, res, next);
});

/* 会员登陆 */
router.post('/mlogin',function (req,res,next) {
    userDao.memberLogin(req,res,next);
});
module.exports = router;
