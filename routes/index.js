var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = '';
  var user_type= '';
  if(req.cookies.username){
      user = req.cookies.username;
      user_type = req.cookies.user_type;
  }
  res.render('index', { title: 'NMStore',user: user,user_type:user_type});
});

module.exports = router;
