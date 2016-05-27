var express = require('express');
var router = express.Router();

var storeDao = require('../dao/storeDao');
var userDao = require('../dao/userDao');
var chatDao = require('../dao/chatDao');

router.get('/:id', function (req, res, next) {
    var url = req.originalUrl;
    var user_id = url.match(/u\d+/g)[0];
    var store_id = url.match(/s\d+/g)[0];
    user_id = user_id.substring(1, user_id.length);
    store_id = store_id.substring(1, store_id.length);
    var flag = false;
    var roomid = 'u'+user_id+'s'+store_id;
    var content = [];
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
                        return chatDao.getChatContent(roomid);
                    }
                    else{
                        console.log(req.cookies.user_id)
                        throw new Error('now I know this happened');
                    }
                }
                else{
                    throw new Error('now I know this happened');
                }
            })
            .then(function (result) {
                console.log(result);
                if(result){
                    if(result.content){
                        content = result.content.split(';');
                    }  
                }
                console.log(content);
                res.render('chat',{content:content,username:req.cookies.username});
            },function (error) {
                res.render('error',{message:'404'});
            });
    }
    else {
        res.redirect('../users/login');
    }
});

module.exports = router; 