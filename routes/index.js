var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = '';
  var user_type= '';
  if(req.session.user){
      user = req.session.user;
      user_type = req.session.user_type;
  }
  res.render('index', { title: 'NMStore',user: user,user_type:user_type});
});

router.get('/addUser', function(req, res, next) {
  userDao.add(req, res, next);
});

module.exports = router;
