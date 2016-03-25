/**
 * userDao层,完成对user表增删改查功能
 */
var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');


var pool = mysql.createPool($conf.mysql);

function add(req,res,next) {
    pool.getConnection(function (err,connection) {
        connection.query('SELECT * FROM users WHERE username = "' + req.body.username + '"',function (err,result) {
            console.log(result);
            console.log(err);
           if(!err){
               if(result){
                   //用户名未重复
                   console.log('用户重复');
                   res.send({type:1});
               }
               else{
                   //用户名重复
                   console.log('用户名未重复');
                   connection.query('INSERT INTO users(user_id,username,phone,pwd,address,user_type) VALUES(0,?,?,?,?,?)', [req.body.username, req.body.phone, req.body.pwd, req.body.address, 3], function(err, result) {
                       if (result) {
                           res.send({type:0});
                       }
                   });
               }
           }
           connection.release();
        });
    });
};

module.exports = {
    add:add,
};