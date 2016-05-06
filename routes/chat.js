var express = require('express');
var router = express.Router();

var storeDao = require('../dao/storeDao');
var userDao = require('../dao/userDao');

router.get('/:id', function (req, res, next) {
    var url = req.originalUrl;
    var user_id = url.match(/u\d+/g)[0];
    var store_id = url.match(/s\d+/g)[0];
    user_id = user_id.substring(1, user_id.length);
    store_id = store_id.substring(1, store_id.length);
    var flag = false;

    if ((req.cookies.username && req.cookies.user_type && req.cookies.user_id)) {
        storeDao.getStore(store_id)
            .then(function (result) {
                if(result){
                    flag = true;
                    return true;
                }
                else{
                    return false;
                }
            })
            .then(function (result) {
                if(result){
                    if(req.cookies.user_id == user_id || req.cookies.store_id == store_id){
                        res.render('chat');
                    }
                    else{
                        console.log(req.cookies.user_id)
                        res.render('error',{message:'404'});
                    }
                }
                else{
                    res.render('error',{message:'404'});
                }
            });
    }
    else {
        res.redirect('../users/login');
    }
});

module.exports = router; 