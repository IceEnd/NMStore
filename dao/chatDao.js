var mysql = require('mysql');
var $conf = require('../database/mysqlDB.js');
var pool = mysql.createPool($conf.mysql);
var Q = require('q');

/** 查询roomid */
function getChatByRoom(roomid) {
    var defer = Q.defer();

    pool.getConnection(function (err, connection) {
        connection.query('select * from chat where room_id = "' + roomid + '" AND status = 0', function (err, result) {
            if (!err) {
                defer.resolve(result);
            }
            else {
                console.log(err);
                defer.reject(err);
            }
            connection.release();
        });
    });
    return defer.promise;
}

/**新建聊天 */
function createChat(user_id, store_id, room_id, username) {
    var defer = Q.defer();
    var date = new Date();
    console.log(user_id);
    console.log(date);
    pool.getConnection(function (err, connection) {
        connection.query("INSERT INTO chat(chat_id,user_id,store_id,room_id,username,latest_time,status) VALUES(0,?,?,?,?,?,?)",
            [user_id, store_id, room_id, username, date, 0], function (err, result) {
                if (!err) {
                    defer.resolve(true);
                }
                else {
                    console.log(err);
                    defer.reject(err);
                }
                connection.release();
            });
    });
    return defer.promise;
}

/**更新聊天信息 */
function updateNote(roomid, str, date) {
    var defer = Q.defer();
    str = ';' + str;
    pool.getConnection(function (err, connection) {
        connection.query('UPDATE chat set content=content + ' + str + ' set latest_time = "' + date + '" where room_id =' + roomid, function (err, result) {
            if (!err) {
                defer.resolve(true);
            }
            else {
                console.log(err);
                defer.reject(err);
            }
            connection.release();
        });
    });
    return defer.promise;
}

/**查看店铺的消息 */
function getChatOfStore(store_id) {
    var defer = Q.defer();
    pool.getConnection(function (err, connection) {
        connection.query('SELECT * from chat where store_id = ' + store_id + ' AND status = 0 order by chat_id  desc', function (err, result) {
            if (!err) {
                defer.resolve(result);
            }
            else {
                console.log(err);
                defer.reject(err);
            }
            connection.release();
        });
    });
    return defer.promise;
}

/**店铺会话数量 */
function getStoreChatAmount(store_id) {
    var defer = Q.defer();

    pool.getConnection(function (err, connection) {
        connection.query('select COUNT(*) from chat where store_id = ' + store_id, function (err, result) {
            if (!err) {
                defer.resolve(result);
            }
            else {
                console.log(err);
                defer.reject(err);
            }
            connection.release();
        });
    });
    return defer.promise;
}

/** 删除会话 */
function delChatById(chat_id) {
    var defer = Q.defer();

    pool.getConnection(function (err, connection) {
        connection.query('UPDATE chat set status = 1 where chat_id = ' + chat_id, function (err, result) {
            if (!err) {
                defer.resolve(true);
            }
            else {
                console.log(err);
                defer.reject(err);
            }
            connection.release();
        })
    });
    return defer.promise;
}

module.exports = {
    getChatByRoom: getChatByRoom,
    createChat: createChat,
    updateNote: updateNote,
    getChatOfStore: getChatOfStore,
    getStoreChatAmount: getStoreChatAmount,
    delChatById:delChatById,
}