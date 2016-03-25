var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NMStore' });
});

router.get('/addUser', function(req, res, next) {
  userDao.add(req, res, next);
});

module.exports = router;
