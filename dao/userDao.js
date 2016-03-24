/**
 * userDao层,完成对user表增删改查功能
 */
var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');


var pool = mysql.createPool($conf.mysql);

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
  if(typeof ret === 'undefined') {
    res.json({
      code:'1',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};

function add(req,res,next) {
    pool.getConnection(function (err,connection) {
        var param = req.query || req.params; 
        console.log(param);
        connection.query('INSERT INTO users(user_id,username,phone,pwd,address,user_type) VALUES(0,?,?,?,?,?)',[param.username,param.phone,param.pwd,param.address,param.user_type],function (err,result) {
          if(result){
              result={
                  code:200,
                  msg:'注册成功！'
               }
          }     
        jsonWrite(res, result);
        connection.release();
       });
    });
};

module.exports = {
    add:add,
};